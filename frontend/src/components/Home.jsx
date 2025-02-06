import React from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import '../App.css';

function Home({recipes}) {
  return (
    <section className="full-height-section">
      <Card>
        <CardBody className="text-center">
          <CardTitle>
            <h3 className="font-weight-bold">
              Welcome to your group's Vault!
            </h3>
          </CardTitle>
          <p>There are {recipes.length} recipes saved for you to check!</p>
        </CardBody>
      </Card>
    </section>
  );
}

export default Home;