import React, { useState } from "react";
import {Card, CardBody, CardTitle, CardText } from "reactstrap";
import './Search.css';
import axios from 'axios';

function Search(){
    // State to hold the search query
    const [searchQuery, setSearchQuery] = useState('');  // State for the search query
    const [recipes, setRecipes] = useState([]); // State to store the fetched recipes
    const [loading, setLoading] = useState(false); // State to handle loading state
    const [error, setError] = useState(null); // State for handling errors
    const [warning, setWarning] = useState(null); // State for warning message

    const placeholderText = "Search recipe by type of food, or comma separated ingredients"; // Placeholder text
    const API_KEY = '0ab4c6cfe91942e993dd97a0422313f0'; // Replace with your Spoonacular API Key

    // Handle change in the search bar
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value); // Update the search query as the user types
    };

    // Function to fetch ingredients for a specific recipe
    const fetchIngredients = async (recipeId) => {
        try {
          const response = await axios.get(
            `https://api.spoonacular.com/recipes/${recipeId}/ingredientWidget.json`,
            { params: { apiKey: API_KEY } }
          );
      
          // Extract ingredient names as a comma-separated list
          const ingredientsList = response.data.ingredients.map(ingredient => ingredient.name).join(", ");
      
          return ingredientsList;
        } catch (error) {
          console.error(`Error fetching ingredients for recipe ${recipeId}:`, error);
          return "Ingredients not available";
        }
      };
    
      // Function to handle form submission and call Spoonacular API
    const handleSearchSubmit = async (event) => {
      event.preventDefault();
      
      if (searchQuery.trim() === '') return; // Don't search if the query is empty
  
      setLoading(true);
      setError(null);
      setWarning(null); // Reset warning on new search
      
      try {
        // Make the API request to Spoonacular for recipes based on the search query
        const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
          params: {
            query: searchQuery, // Recipe name or ingredients
            number: 3,           // Number of recipes to return
            sort: "random",
            addRecipeInformation: true,
            apiKey: API_KEY,     // Your Spoonacular API key
          },
        });
        if (!response.data.results || response.data.results.length === 0) {
            setRecipes([]);  // Explicitly set an empty array to trigger re-render
            showWarning("No recipes found for your search. Try comma separated ingredients i.e potatoes,garlic OR different food type i.e pasta")
        } else {
            // Fetch ingredients for each recipe and store them in state
            const recipesWithIngredients = await Promise.all(
                response.data.results.map(async (recipe) => {
                    const ingredients = await fetchIngredients(recipe.id);
              return { ...recipe, ingredients }; // Store ingredients inside the recipe object
            })
            );
            setRecipes(recipesWithIngredients); // Set the recipes data
            setWarning(null); // Clear the warning if recipes are found
        }
      } catch (error) {
        setError('Error fetching data from Spoonacular'); // Handle any errors
        setRecipes([]); // Clear previous results in case of an error
      } finally {
        setLoading(false); // Set loading to false when request completes
      }
    };

    // Function to display a warning message when no results are found
    const showWarning = (message) => {
        setWarning(message);
    };

    // Function to remove <a> tags from the summary string
    const removeLinks = (htmlString) => {
      return htmlString.replace(/<a[^>]*>(.*?)<\/a>/g, '$1'); // Remove <a> tags and preserve inner text
    };


    return(
        <div className="search-container">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange} // Updates the state as the user types
            placeholder={placeholderText}
            className="search-input"
            style={{ width: `${placeholderText.length}ch` }}
          />
          <button type="submit" className="search-button">Search</button>
        </form>
        {/* Display loading state */}
        {loading && <p>Loading...</p>}

        {/* Display error state */}
        {error && <p>{error}</p>}

        {/* Display warning message */}
        {warning && <p className="warning-text">{warning}</p>}

        {/* Display recipe results below the search bar */}
        <div className="recipe-results-container">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <img src={recipe.image} alt={recipe.title} className="recipe-image" />
              <h3>{recipe.title}</h3>
              <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
            
            {/* Render the summary with HTML content */}
            <div className="recipe-summary"
              dangerouslySetInnerHTML={{ __html: removeLinks(recipe.summary) }}
            />
            </div>
          ))}
        </div>
        </div>    
    );
}

export default Search;