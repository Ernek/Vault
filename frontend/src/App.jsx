import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import NavBar from "./components/NavBar.jsx";
import Home from "./components/Home.jsx";
import Register from "./components/Register.jsx"; // Import Register Page
import Login from "./components/Login.jsx"; // Import Login Page
import FoodElement from './components/FoodElement.jsx';
import EditRecipe from './components/EditRecipe.jsx';
import Item from "./components/Item.jsx";
import AddItem from './components/AddItem.jsx';
import Search from './components/Search.jsx';
import axios from 'axios';


function App() {
  const [recipes, setRecipes] = useState([]);
  const [user, setUser] = useState(null);

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

    async function verifyUser() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Set token globally for authenticated requests
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Fetch authenticated user details
          const response = await axios.get("https://vault-g3r4.onrender.com/api/user");
          setUser({ username: response.data.username });
        } catch (error) {
          console.error("Invalid or expired token:", error);
          logout(); // Auto-logout on invalid token
        }
      }
    }

    fetchRecipes();
    verifyUser();
    }, []);

  const login = async (username, password) => {
    try {
      // const response = await axios.post("http://localhost:5000/api/login", { username, password });
      const response = await axios.post("https://vault-g3r4.onrender.com/api/login", { username, password });
      const token = response.data.token;
      // Store token securely
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Fetch and set user details
      setUser({ username });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  
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
          <Route path="/" element={<Home recipes={recipes} user={user} login={login} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login login={login} />} />
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
