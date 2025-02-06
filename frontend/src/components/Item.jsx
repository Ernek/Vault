import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { Card, CardBody, CardTitle, CardText } from "reactstrap";

function Item({items, cantFind }) {
  const { id } = useParams();
  console.log(id)
  console.log(items)
  let item = items?.find(item => item.id === Number(id));
  console.log(item)
  if (!item) return <Navigate to={cantFind} />;
  
  return (
    <section>
      <Card>
        <CardBody>
          <CardTitle className="font-weight-bold text-center">
            <h3>{item.name} </h3>
          </CardTitle>
          <CardText className="font-italic">{item.description}</CardText>
          <p>
            <b>Ingredients:</b> {item.ingredients}
          </p>
        </CardBody>
      </Card>
    </section>
  );
}

export default Item;