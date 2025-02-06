import React from "react";
import "./NavBar.css";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";

function NavBar() {
  return (
    <div>
      <Navbar expand="md">
        <NavLink exact to="/" className="navbar-brand">
          Vault
        </NavLink>

        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink to="/food">Our Recipes</NavLink>
          </NavItem>
          {/* <NavItem>
            <NavLink to="/boardgames">BoardGames</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/movies">Movies</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/books">Books</NavLink>
          </NavItem> */}
          <NavItem>
            <NavLink to="/add-item">Add Recipe</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/search">Search</NavLink>
          </NavItem>
        </Nav>
      </Navbar>
    </div>
  );
}

export default NavBar;
