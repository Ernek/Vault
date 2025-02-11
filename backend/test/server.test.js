require('dotenv').config();
const request = require('supertest');
const { app, pool, server, startServer } = require('../server');

let testServer; // Store test server instance
let token = ""; // Store authentication token

beforeAll(async () => {
  testServer = await startServer(); // Ensure the server is fully started before running tests

  // 🛑 Clean up tables before running tests
  await pool.query("DELETE FROM users;");
  await pool.query("DELETE FROM recipes;");
  await pool.query("ALTER SEQUENCE users_id_seq RESTART WITH 1;"); // Reset ID sequence
  await pool.query("ALTER SEQUENCE recipes_id_seq RESTART WITH 1;");
  // Create test tables before running tests
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS recipes (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      image TEXT,
      ingredients TEXT,
      description TEXT,
      preparationtime TEXT,
      tags TEXT
    );
  `);

  // Register a test user
  await request(app).post("/api/register").send({
      username: "testuser",
      password: "testpassword"
    });
  // Log in and get the token
  const res = await request(app).post("/api/login").send({
    username: "testuser",
    password: "testpassword"
  });

  token = res.body.token; // Store the token

});

afterAll(async () => {
  await pool.end(); // Close the database connection
  if (testServer) {
    testServer.close(); // Properly close the server
  }
});

describe("User Authentication Tests", () => {
  let token = "";

  test("Register a new user", async () => { 
    const randomUsername = `testuser_${Date.now()}`; // Ensure a unique username

    const res = await request(app).post("/api/register").send({
      username: randomUsername,
      password: "testpassword"
    });
    console.log("Register Response:", res.body); 
    expect(res.statusCode).toBe(201);
    expect(res.body.user.username).toBe(randomUsername);
  });

  test("Login with correct credentials", async () => {
    const res = await request(app).post("/api/login").send({
      username: "testuser",
      password: "testpassword"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  test("Login with wrong password", async () => {
    const res = await request(app).post("/api/login").send({
      username: "testuser",
      password: "wrongpassword"
    });

    expect(res.statusCode).toBe(401);
  });
});

describe("Recipe API Tests", () => {
  let recipeId = "";

  test("Create a new recipe", async () => {
    const res = await request(app)
      .post("/api/recipes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Recipe",
        image: "test.jpg",
        ingredients: "Test Ingredients",
        description: "Test Description",
        preparationtime: "30 mins",
        tags: "test"
      });

    expect(res.statusCode).toBe(201);
    recipeId = res.body.item.id;
  });

  test("Get all recipes", async () => {
    const res = await request(app)
      .get("/api/recipes")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("Delete a recipe", async () => {
    const res = await request(app)
      .delete(`/api/recipes/${recipeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(201);
  });
});
