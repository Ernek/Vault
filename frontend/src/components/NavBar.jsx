import React from "react";
import "./NavBar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavItem, Button } from "reactstrap";

function NavBar({ user, logout }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div>
      <Navbar expand="md">
        <NavLink to="/" className="navbar-brand">
          Vault
        </NavLink>

        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink to="/food">Our Recipes</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/add-item">Add Recipe</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/search">Search</NavLink>
          </NavItem>

         {/* Show Register/Login if user is NOT authenticated */}
         {!user ? (
            <>
              <NavItem>
                <NavLink to="/register">Register</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/login">Login</NavLink>
              </NavItem>
            </>
          ) : (
            // Show Logout if user is authenticated
            <NavItem>
              <Button color="danger" onClick={handleLogout}>
                Logout
              </Button>
            </NavItem>
          )}
        </Nav>
      </Navbar>
    </div>
  );
}

export default NavBar;
