import React from "react";
import { Link } from "react-router-dom";
import {Card, CardBody, CardTitle,    
        ListGroup, ListGroupItem} from "reactstrap";
import "./Element.css";

function Element({ recipes }){
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
                        <Link to={`${item.id}`} key={item.id}>
                        <ListGroupItem>{item.name}</ListGroupItem>
                        </Link>
                    ))}
                    </ListGroup>
                </CardBody>
            </Card>
            </div>
        </section>
    );
}

export default Element;