import React, { useState, useEffect }  from "react";
import { Card, CardBody, CardTitle, Button, Input } from "reactstrap";
import '../App.css';
import axios from "axios";

function Home({ user, login, error }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [recipes, setRecipes] = useState([])
  const [validationError, setValidationError] = useState(null);
  // For local development 
  const API_URL = import.meta.env.VITE_DATABASE_URL;
  useEffect(() => {
    if (user) {
      fetchRecipes();  // Fetch recipes dynamically when user logs in
    }
  }, [user]);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/recipes`);
      setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const handleLogin = () => {
    // Basic frontend validation
    if (!username.trim() || !password.trim()) {
      setValidationError("Username and password are required");
      return;
    }

    // Clear previous validation errors
    setValidationError(null);
    login(username, password);
  };

  return (
    <section className="full-height-section">
      <Card>
        <CardBody className="text-center">
          <CardTitle>
            <h3 className="font-weight-bold">
              Welcome to your group's Vault!
            </h3>
          </CardTitle>
          {!user ? (
            <>
             {validationError && <p style={{ color: "red" }}>{validationError}</p>}
             {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error message */}
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button color="primary" onClick={() => login(username, password)}>
                Login
              </Button>
            </>
          ) : (
            <p>Welcome, {user.username}! You have access to {recipes.length} recipes.</p>
          )}
        </CardBody>
      </Card>
    </section>
  );
}

export default Home;