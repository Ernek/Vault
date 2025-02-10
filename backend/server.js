const express = require("express");
const { Pool } = require('pg');
const cors = require("cors");
const bodyParser = require('body-parser');
// const sequelize = require("./config/database");
const recipeRoutes = require("./routes/recipeRoutes");
const Recipe = require('./models/Recipe')
const axios = require("axios");

require("dotenv").config();

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
const pool = new Pool({
  connectionString: process.env.DATABASE_SUPABASE_URL, // Use environment variable
  ssl: { rejectUnauthorized: false } // Required for Supabase
});

// Create table if it doesn't exist
const createTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS recipes (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        image TEXT,
        ingredients TEXT,
        description TEXT,
        preparationtime TEXT,
        tags TEXT
      );
    `);
    console.log('Database and table checked/created');
  } catch (err) {
    console.error('Error creating table:', err);
    throw err;
  }
};

const axios = require("axios");

// Fetch ingredients for a specific recipe from Spoonacular (Proxy route)
app.get('/api/spoonacular/ingredients', async (req, res) => {
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


// Fetch recipes from Spoonacular API (Proxy route)
app.get('/api/spoonacular/recipes', async (req, res) => {
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


app.get('/api/recipes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM recipes');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});
// Route to handle search by tags
app.get('/api/recipes/search', async (req, res) => {
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

app.get('/api/recipes/:id', async (req, res) => {
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

app.put('/api/recipes/:id', async (req, res) => {
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
app.delete('/api/recipes/:id', async (req, res) => {
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
app.post('/api/recipes', async (req, res) => {
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

// For use with db hosted in Supabase
const startServer = async () => {
  try {
    await createTable(); // Ensure table exists before listening
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to initialize database:", error);
    process.exit(1); // Stop server if DB setup fails
  }
};

startServer();
