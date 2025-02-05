import React, { useState, useEffect } from 'react'
import { BrowserRouter } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NavBar from "./components/NavBar.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
    <NavBar />
    </BrowserRouter>
    </>
  )
}

export default App
