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
    const [message, setMessage] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
       // Validate inputs
      if (!name) {
          setMessage('Please fill out at least the name of the recipe.');
          return;
      }   
      
      const newItem = {
          name,
          image,
          ingredients,
          description,
        };
    
      try {
        const response = await axios.post(
          `http://localhost:5000/api/recipes`, // 'drinks' or 'snacks' endpoint
          newItem
        );
        if (response.status === 201) {
          setMessage(`${name} has been added successfully!`);
  
          // Update the state in App.jsx
          setRecipes((prevSnacks) => [...prevSnacks, newItem]);
          // Reset form
          setName('');
          setImage('');
          setDescription('');
          setIngredients('');
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
                  />
                </div>
                <div>
                  <label>Image:</label>
                  <textarea
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                </div>
                <div>
                  <label>Description:</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div>
                  <label>Ingredients:</label>
                  <textarea
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
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