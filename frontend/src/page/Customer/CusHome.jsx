import React from 'react';
import { Button, Container, Card, Row, Col } from 'react-bootstrap';
import h1Image from '../../assets/h1.png'; 
import ProfilenavBar from '../../component/ProfilenavBar';
import { useNavigate } from 'react-router-dom';
import Footer from '../../component/Footer';

function CusHome() {
  const navigate = useNavigate();

  const cardStyle = {
    width: '18rem',
    border: '2px solid black' // Adjust the border thickness and color as needed
  };

  return (
    <>
      <div><ProfilenavBar userType="customer" /></div>

      <br />
      <br />
      <div className="d-flex justify-content-around">
        <Container>
          <Row>
            <Col xs={6} md={4}>
              <Card style={cardStyle}>
                <Card.Img variant="top" src={h1Image} />
                <Card.Body>
                  <Card.Title>Orders</Card.Title>
                  <Card.Text>
                    Easily place orders for your needs and also you can check your bill here.
                  </Card.Text>
                  <Button onClick={() => navigate("/orders")} variant="primary">View Details</Button>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={6} md={4}>
              <Card style={cardStyle}>
                <Card.Img variant="top" src={h1Image} />
                <Card.Body>
                  <Card.Title>Payments</Card.Title>
                  <Card.Text>
                    Quickly check past orders and see if they've been paid or are still outstanding.
                  </Card.Text>
                  <Button onClick={() => navigate("/cpayment")} variant="primary">View Details</Button>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={6} md={4}>
              <Card style={cardStyle}>
                <Card.Img variant="top" src={h1Image} />
                <Card.Body>
                  <Card.Title>Order Calendar</Card.Title>
                  <Card.Text>
                  View your pending, approved, and rejected orders along with their details effortlessly.
                  </Card.Text>
                  <Button onClick={() => navigate("/ocalendar")} variant="primary">View Details</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <br />
      <br />
      <div><Footer /></div>
    </>
  ); 
}

export default CusHome;
