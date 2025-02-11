import React, { useState } from 'react';
import {
    Card,
    CardBody,
    CardTitle,
  } from "reactstrap";
  import axios from 'axios';

function AddItem({ setRecipes }){
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [description, setDescription] = useState('');
    const [preparationtime, setPreparationTime] = useState('');
    const [message, setMessage] = useState('');
    const [tags, setTags] = useState('');
    // For local development 
    // const API_URL = import.meta.env.VITE_DATABASE_URL;
    // For deployment
    const API_URL = import.meta.env.VITE_RENDER_API_URL;
    const handleSubmit = async (e) => {
      e.preventDefault();
       // Validate inputs
      if (!name.trim()) {
          setMessage('Please fill out at least the name of the recipe.');
          return;
      }   
      
      const newItem = {
          name,
          image,
          ingredients,
          description,
          preparationtime,
          tags
        };
    
      try {
        const response = await axios.post(
          // `http://localhost:5000/api/recipes`, // 'recipes' endpoint
          `${API_URL}/api/recipes`, // 'recipes' endpoint 
          newItem
        );
        if (response.status === 201) {
          setMessage(`${name} has been added successfully!`);
  
          // Update the state in App.jsx
          setRecipes((prevRecipes) => [...prevRecipes, response.data.item]);
          // Reset form
          setName('');
          setImage('');
          setDescription('');
          setIngredients('');
          setPreparationTime('');
          setTags('');
        } else {
          setMessage('Failed to add the item. Please try again.');
        }
      } catch (error) {
        console.error('Error adding item:', error);
        setMessage('An error occurred while adding the item.');
      }
    };

    return(
        <section className="element-height-container">
            <div className="col-md-4-container">
            <Card>
                <CardBody>
                    <CardTitle className="font-weight-bold text-center"> 
                        Add a custom recipe
                    </CardTitle>
                <form onSubmit={handleSubmit}>
                <div>
                  <label>Recipe Name:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter name of the recipe"
                  />
                </div>
                <div>
                  <label>Image:</label>
                  <textarea
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Enter URL of image"
                  />
                </div>
                <div>
                  <label>Description:</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description"
                  />
                </div>
                <div>
                  <label>Ingredients:</label>
                  <textarea
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="Enter ingredients (e.g., lamb, tomatoes)"
                  />
                </div>
                <div>
                  <label>Preparation Time:</label>
                  <textarea
                    value={preparationtime}
                    onChange={(e) => setPreparationTime(e.target.value)}
                    placeholder="Enter preparation time (e.g 40 minutes)"
                  />
                </div>
                <div>
                  <label>Tags:</label>
                  <textarea
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Enter tags (e.g., vegan, quick, healthy)"
                  />
                </div>
                <button type="submit">Add Item</button>
                </form>
                {message && <p>{message}</p>}
                </CardBody>
            </Card>
            </div>
        </section>
    );
}

export default AddItem;