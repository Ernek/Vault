import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditRecipe({ setRecipes }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null); // Initially null to handle loading state
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true); // Track loading state
    const API_URL = import.meta.env.VITE_DATABASE_URL;
    // Fetch recipe details when component loads
    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                // const response = await axios.get(`http://localhost:5000/api/recipes/${id}`);
                const response = await axios.get(`${API_URL}/api/recipes/${id}`);
                setRecipe(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching recipe:", error);
                setLoading(false); // Even if an error occurs, stop loading
            }
        };

        fetchRecipe();
    }, [id]);

    // Handle input changes
    const handleChange = (e) => {
        setRecipe({ ...recipe, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!recipe.name.trim()) {
            setMessage("Recipe name is required.");
            return;
        }

        try {
            // const response = await axios.put(`http://localhost:5000/api/recipes/${id}`, recipe);
            const response = await axios.put(`${API_URL}/api/recipes/${id}`, recipe);

            if (response.status === 200) {
                setMessage("Recipe updated successfully!");
                setRecipes((prevRecipes) =>
                    prevRecipes.map((r) => (r.id === parseInt(id) ? response.data : r))
                );
                setTimeout(() => navigate("/food"), 1500); // Redirect after success
            } else {
                setMessage("Failed to update recipe. Please try again.");
            }
        } catch (error) {
            console.error("Error updating recipe:", error);
            setMessage("An error occurred while updating the recipe.");
        }
    };

    // Show a loading message until recipe data is fetched
    if (loading) {
        return <p>Loading recipe details...</p>;
    }
    // Handle case where recipe is not found
    if (!recipe) {
        return <p>Recipe not found.</p>;
    } 

    return (
        <section className="edit-container">
            <h2>Edit Recipe</h2>
            <form onSubmit={handleSubmit}>
                <label>Recipe Name:</label>
                <input 
                    type="text" 
                    name="name" 
                    value={recipe.name} 
                    onChange={handleChange}
                />

                <label>Image URL:</label>
                <input 
                    type="text" 
                    name="image" 
                    value={recipe.image || ""} 
                    onChange={handleChange} 
                />

                <label>Ingredients:</label>
                <textarea 
                    name="ingredients" 
                    value={recipe.ingredients || ""} 
                    onChange={handleChange}
                />

                <label>Description:</label>
                <textarea 
                    name="description" 
                    value={recipe.description || ""}
                    onChange={handleChange} 
                />

                <label>Preparation Time:</label>
                <input 
                    type="text" 
                    name="preparationtime" 
                    value={recipe.preparationtime || ""} 
                    onChange={handleChange} 
                />

                <label>Tags:</label>
                <input 
                    type="text" 
                    name="tags" 
                    value={recipe.tags || ""} 
                    onChange={handleChange} 
                />

                <button type="submit">Update Recipe</button>
            </form>
            {message && <p>{message}</p>}
        </section>
    );
}

export default EditRecipe;