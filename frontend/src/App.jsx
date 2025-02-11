import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import NavBar from "./components/NavBar.jsx";
import Home from "./components/Home.jsx";
import Register from "./components/Register.jsx"; // Import Register Page
import FoodElement from './components/FoodElement.jsx';
import EditRecipe from './components/EditRecipe.jsx';
import Item from "./components/Item.jsx";
import AddItem from './components/AddItem.jsx';
import Search from './components/Search.jsx';
import axios from 'axios';


function App() {
  const [recipes, setRecipes] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  // For local development 
  const API_URL = import.meta.env.VITE_DATABASE_URL;

  const fetchRecipes = async () => {
    if (!user) return;  // Prevent fetching when user is not authenticated
  
    try {
      const response = await axios.get(`${API_URL}/api/recipes`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  // ✅ Standalone function to verify user authentication
  const verifyUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axios.get(`${API_URL}/api/user`);
        setUser({ username: response.data.username });
      } catch (error) {
        console.error("Invalid or expired token:", error);
        // logout(); // Auto-logout on invalid token
        setUser(null)
      }
    }
  };

  // ✅ useEffect calls verifyUser() on initial render
  useEffect(() => {
    verifyUser();
  }, []);

  const login = async (username, password) => {
    try {
      // const response = await axios.post("http://localhost:5000/api/login", { username, password });
      const response = await axios.post(`${API_URL}/api/login`, { username, password });
      const token = response.data.token;
      // Store token securely
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Fetch and set user details
      setUser({ username });
      // Fetch recipes again after login
      fetchRecipes();
      setError(null); // Clear error if login is successful
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Login failed");
      } else {
      console.error("Login failed:", error);
      setError("An error ocurred. Please try again."); // Set error message
      }
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchRecipes();
    }
  }, [user]);

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };
  
  return (
    <>
    <BrowserRouter>
      <NavBar user={user} logout={logout} />
      <main>
        <Routes>
          <Route path="/" element={<Home user={user} login={login} error={error}/>} />
          <Route path="/register" element={<Register />} />
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
