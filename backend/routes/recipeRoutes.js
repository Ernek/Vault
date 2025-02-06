const express = require("express");
const Recipe = require("../models/Recipe");

const router = express.Router();

// Fetch all items
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.findAll();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

module.exports = router;
