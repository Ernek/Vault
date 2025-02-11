import React, { useState }  from "react";
import { Card, CardBody, CardTitle, Button, Input } from "reactstrap";
import '../App.css';

function Home({ recipes, user, login }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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