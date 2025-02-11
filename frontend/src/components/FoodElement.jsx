import React, { useState, useEffect } from "react";
import Element from "./Element";
import axios from "axios"

function FoodElement({ recipes, setRecipes }){
    const [searchTag, setSearchTag] = useState('');
    const [allRecipes, setAllRecipes] = useState([]); // Store all recipes for resetting
    // For local development 
    // const API_URL = import.meta.env.VITE_DATABASE_URL;
    // For deployment
    const API_URL = import.meta.env.VITE_RENDER_API_URL;
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                // const response = await axios.get("http://localhost:5000/api/recipes");
                const response = await axios.get(`${API_URL}/api/recipes`);
                setRecipes(response.data); // Update state with latest database data
                setAllRecipes(response.data); // Save full list
            } catch (error) {
                console.error("Error fetching recipes:", error);
            }
        };

        fetchRecipes();
    }, []); // Runs only when component mounts

    const handleTagSearch = async (e) => {
        e.preventDefault();
        if (!searchTag.trim()) {
            setRecipes(allRecipes); // Reset if search is cleared
            return;
        }
        try {
            // const response = await axios.get(`http://localhost:5000/api/recipes/search?tag=${searchTag}`);
            const response = await axios.get(`${API_URL}/api/recipes/search?tag=${searchTag}`);
            setRecipes(response.data);
        } catch (error) {
            console.error("Error searching recipes by tag:", error);
        }
    };
    return (
    <div>
    <form onSubmit={handleTagSearch}>
        <input 
            type="text" 
            value={searchTag} 
            onChange={(e) => setSearchTag(e.target.value)} 
            placeholder="Search by tag (e.g., vegan, quick)"
        />
        <button type="submit">Search</button>
        {/* Reset Button */}
        {searchTag && <button type="button" onClick={() => {
            setSearchTag('');
            setRecipes(allRecipes);
        }}>Reset</button>}
    </form>
    <Element recipes={recipes} setRecipes={setRecipes} />
    </div>
    );
}
export default FoodElement
