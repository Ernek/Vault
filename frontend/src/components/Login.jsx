import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ login }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
    //   const response = await axios.post("http://localhost:5000/api/login", { username, password });
      const response = await axios.post("https://vault-g3r4.onrender.com/api/login", { username, password });
      localStorage.setItem("token", response.data.token);
      login({ username, token: response.data.token }); // Update App state
      navigate("/"); // Redirect to Home page
    } catch (error) {
      setError(error.response?.data?.message || "Login failed.");
      console.error("Login error:", error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input 
        type="text" 
        placeholder="Username" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;