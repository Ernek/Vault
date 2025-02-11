import React from "react";
import "./NavBar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavItem, Button } from "reactstrap";

function NavBar({ user, logout }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <div>
      <Navbar expand="md">
        <NavLink to="/" className="navbar-brand">
          Vault
        </NavLink>

        <Nav className="ml-auto" navbar>
        {user ? (
          <>
          <NavItem>
            <NavLink to="/food">Our Recipes</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/add-item">Add Recipe</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/search">Search</NavLink>
          </NavItem>
            {/* Show Logout if user is authenticated */}
            <NavItem>
              <Button color="danger" onClick={handleLogout}>
                Logout
              </Button>
            </NavItem>
          </>
          ) : (
            <>
              <NavItem>
                <NavLink to="/register">Register</NavLink>
              </NavItem>
            </>
          )}
        </Nav>
      </Navbar>
    </div>
  );
}

export default NavBar;
