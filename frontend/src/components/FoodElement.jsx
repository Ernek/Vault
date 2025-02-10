import React, { useState, useEffect } from "react";
import Element from "./Element";
import axios from "axios"

function FoodElement({ recipes, setRecipes }){
    const [searchTag, setSearchTag] = useState('');
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/recipes");
                setRecipes(response.data); // Update state with latest database data
            } catch (error) {
                console.error("Error fetching recipes:", error);
            }
        };

        fetchRecipes();
    }, []); // Runs only when component mounts

    const handleTagSearch = async (e) => {
        e.preventDefault();
        if (!searchTag) return;

        try {
            const response = await axios.get(`http://localhost:5000/api/recipes/search?tag=${searchTag}`);
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
    </form>
    <Element recipes={recipes} setRecipes={setRecipes} />
    </div>
    );
}
export default FoodElement
