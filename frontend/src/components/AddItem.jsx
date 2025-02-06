import React, { useState } from 'react';
import {
    Card,
    CardBody,
    CardTitle,
  } from "reactstrap";
  import axios from 'axios';

function AddItem(){
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

export default AddItem;