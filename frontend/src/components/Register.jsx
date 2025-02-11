import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
    //   await axios.post("http://localhost:5000/api/register", { username, password });
      await axios.post("https://vault-g3r4.onrender.com/api/register", { username, password });
      navigate("/login"); // Redirect to login after successful registration
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