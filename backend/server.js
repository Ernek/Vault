const express = require("express");
const { Pool } = require('pg');
const cors = require("cors");
const bodyParser = require('body-parser');
// const sequelize = require("./config/database");
const recipeRoutes = require("./routes/recipeRoutes");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
// Middleware to parse JSON bodies
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create table if it doesn't exist
const createTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS recipes (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        image TEXT NOT NULL,
        ingredientes TEXT NOT NULL,
        description TEXT NOT NULL
      );
    `);
    console.log('Database and table checked/created');
  } catch (err) {
    console.error('Error creating table:', err);
  }
};


app.get('/api/recipes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM recipes');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// Example endpoint to handle POST requests
app.post('/api/recipes', async (req, res) => {
  const { name, image, ingredients, description } = req.body;
 
  try {
    const query = 'INSERT INTO recipes (name, image, ingredients, description) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [name, image, ingredients, description];

    const result = await pool.query(query, values);

    // Return the newly added item
    res.status(201).json({ message: 'Item added successfully!', item: result.rows[0] });
  } catch (error) {
    console.error('Error saving item:', error);
    res.status(500).json({ message: 'Error saving item', error });
}
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await createTable();
  console.log(`Server running on port ${PORT}`);
});


// app.use("/api/recipes", recipeRoutes);


// Sync Database and Start Server
// sequelize.sync()
//   .then(() => {
//     console.log("Database synced!");
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch((err) => console.log("Error syncing database:", err));

