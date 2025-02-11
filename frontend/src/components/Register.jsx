import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // For local development 
  // const API_URL = import.meta.env.VITE_DATABASE_URL;
  // For deployment
  const API_URL = import.meta.env.VITE_RENDER_API_URL;
  const handleRegister = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }
    try {
    //   await axios.post("http://localhost:5000/api/register", { username, password });
      await axios.post(`${API_URL}/api/register`, { username, password });
      navigate("/"); // Redirect to login after successful registration
    } catch (error) {
      setError("Registration failed. Username may already be taken.");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Register</h2>
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
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;