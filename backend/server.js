const axios = require("axios");
const express = require("express");
const { Pool } = require('pg');
const cors = require("cors");
const bodyParser = require('body-parser');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

const app = express();
app.use(cors());
app.use(express.json());
// Middleware to parse JSON bodies
app.use(bodyParser.json());

// For local use refer to .env for the URL and the port
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// For Supabase connections
// const pool = new Pool({
//   connectionString: process.env.DATABASE_SUPABASE_URL, // Use environment variable
//   ssl: { rejectUnauthorized: false } // Required for Supabase
// });

// To include testing options 
const isTestEnv = process.env.NODE_ENV === 'test';
// Pick your databaseurl:
// If it is local set variable to not enforce ssl connections
// DATABASE_URL for local, DATABASE_SUPABASE_URL
const databaseurl = process.env.DATABASE_URL 
const isLocal = databaseurl?.includes("localhost") || databaseurl?.includes("127.0.0.1");
const pool = new Pool({
  connectionString: isTestEnv
    ? process.env.TEST_DATABASE_URL
    : databaseurl,
    // : process.env.DATABASE_SUPABASE_URL,
  ssl: isTestEnv || isLocal ? false : { rejectUnauthorized: false },
});




// **** TABLES **** //
// Create Tables if not existent
const createTables = async () => {
  const queries = [
    `CREATE TABLE IF NOT EXISTS users (
       id SERIAL PRIMARY KEY,
       username TEXT UNIQUE NOT NULL,
       password TEXT NOT NULL
     );`,
    `CREATE TABLE IF NOT EXISTS recipes (
       id SERIAL PRIMARY KEY,
       name TEXT NOT NULL,
       image TEXT,
       ingredients TEXT,
       description TEXT,
       preparationtime TEXT,
       tags TEXT
    );`
  ];
  try {
    for (const query of queries) {
      await pool.query(query);
    }
    console.log('Users table checked/created');
  } catch (err) {
    console.error('Error creating user tables:', err);
    throw err;
  }
};


// *****************   ROUTES  ****************** //

// User Registration
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  // Validate empty fields
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username';
    const values = [username, hashedPassword];
    const result = await pool.query(query, values);

    res.status(201).json({ message: "User registered", user: result.rows[0] });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: "Error registering user", error });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  // Validate empty fields
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in", error });
  }
});

// Middleware to Verify Token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = user;
    next();
  });
};

app.use((req, res, next) => {
  // Allow public access only for login and register routes
  const openRoutes = ["/api/login", "/api/register"];
  if (openRoutes.includes(req.path)) {
    return next();
  }
  authenticateToken(req, res, next);
});

// Fetch ingredients for a specific recipe from Spoonacular (Proxy route)
app.get('/api/spoonacular/ingredients',authenticateToken, async (req, res) => {
  const { recipeId } = req.query;
  const API_KEY = process.env.SPOONACULAR_API_KEY; // Secure API Key

  if (!recipeId) {
      return res.status(400).json({ error: "Recipe ID is required" });
  }

  try {
      const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/ingredientWidget.json`, {
          params: { apiKey: API_KEY },
          headers: {
              "User-Agent": "Vault",
              "Referer": "https://vault-1-0doa.onrender.com"
          }
      });

      // Extract ingredient names as a comma-separated list
      const ingredientsList = response.data.ingredients.map(ingredient => ingredient.name).join(", ");

      res.json({ ingredients: ingredientsList });
  } catch (error) {
      console.error(`❌ Error fetching ingredients for recipe ${recipeId}:`, error);
      res.status(500).json({ error: "Ingredients not available" });
  }
});

// ***** ROUTES ****** //
// Fetch recipes from Spoonacular API (Proxy route)
app.get('/api/spoonacular/recipes',authenticateToken, async (req, res) => {
    const { query } = req.query;
    const API_KEY = process.env.SPOONACULAR_API_KEY; // Use environment variable

    try {
        const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
            params: {
                query,
                number: 3,
                sort: "random",
                addRecipeInformation: true,
                apiKey: API_KEY
            },
            headers: {
                "User-Agent": "Vault",
                "Referer": "https://vault-1-0doa.onrender.com"
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error("❌ Error fetching Spoonacular data:", error);
        res.status(500).json({ error: "Failed to fetch data from Spoonacular API" });
    }
});

// Generic route to fetch all recipes
app.get('/api/recipes', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM recipes');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});
// Route to handle search by tags
app.get('/api/recipes/search',authenticateToken, async (req, res) => {
  const { tag } = req.query;

  try {
      // Ensure case-insensitive search for tags even if they are comma-separated
      const query = `
          SELECT * FROM recipes 
          WHERE tags ILIKE $1 
             OR tags ILIKE $2
             OR tags ILIKE $3
             OR tags ILIKE $4;
      `;
      const values = [`%${tag}%`, `${tag},%`, `%,${tag}`, `%,${tag},%`];

      const result = await pool.query(query, values);

      res.json(result.rows);
  } catch (error) {
      console.error('Error fetching recipes by tag:', error);
      res.status(500).json({ message: 'Error fetching recipes', error });
  }
});

app.get('/api/recipes/:id',authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
      const query = "SELECT * FROM recipes WHERE id = $1;";
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
          return res.status(404).json({ error: `Recipe with ID ${id} not found` });
      }

      res.json(result.rows[0]);
  } catch (error) {
      console.error("Error fetching recipe:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put('/api/recipes/:id',authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, image, ingredients, description, preparationtime, tags } = req.body;

  try {
      const query = `
          UPDATE recipes 
          SET name = $1, image = $2, ingredients = $3, description = $4, preparationtime = $5, tags = $6
          WHERE id = $7 RETURNING *;
      `;
      const values = [name, image, ingredients, description, preparationtime, tags, id];

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
          return res.status(404).json({ error: `Recipe with ID ${id} not found` });
      }

      return res.status(200).json(result.rows[0]);
  } catch (error) {
      console.error("Error updating recipe:", error);
      return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete recipe route
app.delete('/api/recipes/:id',authenticateToken, async (req, res) => {
  let { id } = req.params;

  try {
    console.log(`Received DELETE request for recipe ID: ${id}`); 
    // Check if ID is missing or not a valid number
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid recipe ID" });
    }
    id = parseInt(id); // Convert ID to an integer for safety
    // Remove recipe from the array (or your database)
    const query = 'DELETE FROM recipes WHERE id = $1 RETURNING *;'
    const values = [id]
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Recipe with ID ${id} not found` });
    }    
    // **Fix: Reset the auto-increment sequence**
    const resetQuery = `SELECT setval('recipes_id_seq', COALESCE(MAX(id),1)) FROM recipes;`;
    await pool.query(resetQuery);
    // Return the deleted item
    return res.status(201).json({ message: 'Recipe deleted successfully!', item: result.rows[0] });
  } catch (error) {
    console.error("Server error during delete operation:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Example endpoint to handle POST requests
app.post('/api/recipes',authenticateToken, async (req, res) => {
  const { name, image, ingredients, description, preparationtime, tags } = req.body;
 
  try {
    const query = 'INSERT INTO recipes (name, image, ingredients, description, preparationtime, tags) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [name, image, ingredients, description, preparationtime, tags];

    const result = await pool.query(query, values);

    // Return the newly added item
    res.status(201).json({ message: 'Item added successfully!', item: result.rows[0] });
  } catch (error) {
    console.error('Error saving item:', error);
    res.status(500).json({ message: 'Error saving item', error });
}
});

const PORT = process.env.PORT || 5000;

// For use with local database 
// app.listen(PORT, async () => {
//   await createTable();
//   console.log(`Server running on port ${PORT}`);
// });

let server; // Store the server instance

// For use with db hosted in Supabase
const startServer = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await createTables(); // Ensure tables exist
      server = app.listen(PORT, () => {
        console.log(`✅ Server running on port ${PORT}`);
        resolve(server); // Resolve the server once it's started
      });
    } catch (error) {
      console.error("❌ Failed to initialize database:", error);
      reject(error);
    }
  });
};

// Start the server only when not in test mode
if (process.env.NODE_ENV !== "test") {
  startServer();
}

module.exports = { app, pool, server, startServer };
