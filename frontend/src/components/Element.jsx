import React from "react";
import {Card, CardBody, CardTitle, CardText } from "reactstrap";
import "./Element.css";

function Element(){
    return(
        <section className="element-height-container">
            <div className="col-md-4-container">
            <Card>
                <CardBody>
                    <CardTitle className="font-weight-bold text-center"> 
                        Element
                    </CardTitle>
                    <CardText>
                        Text
                    </CardText>
                </CardBody>
            </Card>
            </div>
        </section>
    );
}

export default Element;