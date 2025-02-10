import React, { useState, useEffect } from 'react'
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import './App.css'
import NavBar from "./components/NavBar.jsx";
import Home from "./components/Home.jsx";
import FoodElement from './components/FoodElement.jsx';
import EditRecipe from './components/EditRecipe.jsx';
import Item from "./components/Item.jsx";
import AddItem from './components/AddItem.jsx';
import Search from './components/Search.jsx';
import axios from 'axios';


function App() {
  // const [isLoading, setIsLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        // const response = await axios.get("http://localhost:5000/api/recipes");
        const response = await axios.get("https://vault-g3r4.onrender.com/api/recipes");
        setRecipes(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchRecipes(); // Call the async function 
    }, []);

  return (
    <>
    <BrowserRouter>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Home recipes={recipes} />} />
          <Route path="/food" element={<FoodElement recipes={recipes} setRecipes={setRecipes} />} />
          <Route path="/food/:id" element={<Item items={recipes} cantFind="/food" />} />
          <Route path="/edit-recipe/:id" element={<EditRecipe setRecipes={setRecipes} />} />
          <Route path="/add-item" element={<AddItem setRecipes={setRecipes} />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </main>
    </BrowserRouter>
    </>
  )
}

export default App
