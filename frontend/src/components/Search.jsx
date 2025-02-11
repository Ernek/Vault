import React, { useState, useEffect } from "react";
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
    const [message, setMessage] = useState('');
    const [addedRecipes, setAddedRecipes] = useState([]);
    // For local development 
    const API_URL = import.meta.env.VITE_DATABASE_URL;
    const placeholderText = "Search recipe by type of food, or comma separated ingredients"; // Placeholder text
    
    // Fetch existing recipes from the database when the component mounts
    useEffect(() => {
      const fetchAddedRecipes = async () => {
        try {
          // const response = await axios.get("http://localhost:5000/api/recipes");
          const response = await axios.get(`${API_URL}/api/recipes`);
          const existingTitles = response.data.map(recipe => recipe.name);
          setAddedRecipes(existingTitles);
        } catch (error) {
          console.error("Error fetching added recipes:", error);
        }
      };

      fetchAddedRecipes();
    }, []);

    // Handle change in the search bar
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value); // Update the search query as the user types
    };
    // NEW: Fetch from backend instead of Spoonacular directly
    const fetchIngredients = async (recipeId) => {
      try {
        const response = await axios.get(`${API_URL}/api/spoonacular/ingredients`, {
            params: { recipeId },
        });
    
        return response.data.ingredients; // Now using backend proxy
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
        // NEW: Fetch from backend instead of Spoonacular directly
        const response = await axios.get(`${API_URL}/api/spoonacular/recipes`, {
          params: { query: searchQuery },
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
        setError('Error fetching data from Spoonacular, please try another simple ingredient or food type'); // Handle any errors
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

    const handleAddRecipe = async (recipe) => {
      // Check if the recipe has already been added
      if (addedRecipes.includes(recipe.title)) {
        return setMessage(`${recipe.title} has already been added!`);
      }

      const newRecipe = {
        name: recipe.title,
        image: recipe.image,
        ingredients: recipe.ingredients || "N/A",
        description: removeLinks(recipe.summary).replace(/<[^>]*>/g, ""),
        preparationtime: `${recipe.readyInMinutes} minutes`
      };
      console.log(newRecipe)
      try {
        // const response = await axios.post("http://localhost:5000/api/recipes", newRecipe);
        const response = await axios.post(`${API_URL}/api/recipes`, newRecipe);
        if (response.status === 201) {
          setMessage(`${recipe.title} has been added successfully!`);
          // Update state to include the new recipe, add new recipe to list and mark it as added
          setAddedRecipes((prevAdded) => [...prevAdded, recipe.title]);
        } else {
          setMessage("Failed to add the recipe. Please try again.");
        }
      } catch (error) {
        console.error("Error adding recipe:", error);
        setMessage("An error occurred while adding the recipe.");
      }
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
        {message && <p className="message-text">{message}</p>}

        {/* Display recipe results below the search bar */}
        <div className="recipe-results-container">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <img src={recipe.image} alt={recipe.title} className="recipe-image" draggable="false" />
              <h3>{recipe.title}</h3>
              <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
              <p><strong>Preparation Time:</strong> {recipe.readyInMinutes} minutes</p>
            
            {/* Render the summary with HTML content */}
            <div className="recipe-summary"
              dangerouslySetInnerHTML={{ __html: removeLinks(recipe.summary) }}
            />
            {/* + Add Button */}
            <button 
              onClick={() => handleAddRecipe(recipe)} 
              disabled={addedRecipes.includes(recipe.title)}
              className={addedRecipes.includes(recipe.title) ? "disabled-button" : ""}
            >
              {addedRecipes.includes(recipe.title) ? "Already Added" : "+ Add"}
            </button>
            </div>
          ))}
        </div>
        </div>    
    );
}

export default Search;