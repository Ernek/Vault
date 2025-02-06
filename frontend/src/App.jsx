import React, { useState, useEffect } from 'react'
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import './App.css'
import NavBar from "./components/NavBar.jsx";
import Home from "./components/Home.jsx";
import FoodElement from './components/FoodElement.jsx';
import AddItem from './components/AddItem.jsx';
import Search from './components/Search.jsx';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [food, setFood] = useState([]);

  // useEffect(() => {
  //   async function getFood() {
  //     let food = await SnackOrBoozeApi.getFood();
  //     setFood(food);
  //     setIsLoading(false);
  //   }
  //   getSnacks();
  // }, []);

  // setIsLoading(False);

  // if (isLoading) {
  //   return <p>Loading &hellip;</p>;
  // }

  return (
    <>
    <BrowserRouter>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Routes>
          <Route path="/food" element={<FoodElement />} />
        </Routes>
        <Routes>
          <Route path="/search" element={<Search />} />
        </Routes>
      </main>
    </BrowserRouter>
    </>
  )
}

export default App
