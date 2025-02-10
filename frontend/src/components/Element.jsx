import React from "react";
import { Link } from "react-router-dom";
import {Card, CardBody, CardTitle,    
        ListGroup, ListGroupItem} from "reactstrap";
import "./Element.css";
import axios from "axios";
import { FaTrash, FaEdit } from "react-icons/fa";  // Import FontAwesome trash icon

function Element({ recipes, setRecipes }){
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/recipes/${id}`); // Send DELETE request

            // Update state to remove the deleted item from the UI
            setRecipes((prevRecipes) => prevRecipes.filter(recipe => recipe.id !== id));

        } catch (error) {
            console.error("Error deleting recipe:", error);
        }
    };
    return(
        <section className="element-height-container">
            <div className="col-md-4-container">
            <Card>
                <CardBody>
                    <CardTitle className="font-weight-bold text-center"> 
                        Recipes
                    </CardTitle>
                    <ListGroup>
                    {recipes.map(item => (
                        <ListGroupItem key={item.id} className="d-flex justify-content-between align-items-center border-0">
                        {/* Recipe Name Clickable Link */}
                        {/* Left Side: Recipe Name and Tags */}
                        <div className="d-flex align-items-center flex-grow-1">
                        <Link to={`${item.id}`} className="text-decoration-none flex-grow-1">
                        {item.name}
                        </Link>
                        {/* Tags with White Font */}
                        <span className="tag-badge ms-3">({item.tags || "No tags"})</span>
                        </div>
                        {/* Right Side: Edit and Delete Buttons */}
                        <div className="d-flex align-items-center">
                            {/* Edit Button */}
                            <Link to={`/edit-recipe/${item.id}`} className="btn btn-link text-primary p-0 ms-2" title="Edit recipe">
                                <FaEdit size={16} />
                            </Link>
                    
                            {/* Delete Button */} 
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handleDelete(item.id);
                                }} 
                                className="btn btn-link text-danger p-0 ms-2" 
                                style={{ border: "none", background: "none" }} 
                                title="Delete recipe"
                            >
                                <FaTrash size={16} /> 
                            </button>
                        </div>
                        </ListGroupItem>
                    ))}
                    </ListGroup>
                </CardBody>
            </Card>
            </div>
        </section>
    );
}

export default Element;