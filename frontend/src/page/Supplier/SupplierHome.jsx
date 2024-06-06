import React from 'react';
import {Button, Container,Card,Row,Col} from 'react-bootstrap';
import h1Image from '../../assets/h1.png'; 
import SupplierNBar from '../../component/SupplierNBar';
import { useNavigate } from 'react-router-dom';
import Footer from '../../component/Footer';


function SupplierHome() {
  // test
  const Navigate= useNavigate();
  return (
    <>
       <div><SupplierNBar userType="supplier"/></div>

<br></br>
<br></br>
      <div className="d-flex justify-content-around">
        <Container>
          <Row>
            <Col xs={6} md={4}>
              <Card style={{ width: '18rem',border: '2px solid black'  }}>
                <Card.Img variant="top" src={h1Image} />
                <Card.Body>
                  <Card.Title>Transport</Card.Title>
                  <Card.Text>
                  Easily schedule appointments for delivering your goods to the factory.
                  </Card.Text>
                  <Button onClick ={()=> Navigate("/transport")} variant="primary">View Details</Button>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={6} md={4}>
              <Card style={{ width: '18rem',border: '2px solid black'  }}>
                <Card.Img variant="top" src={h1Image} />
                <Card.Body>
                  <Card.Title>Payments</Card.Title>
                  <Card.Text>
                  Quickly check past orders and see if they've been paid or are still outstanding.
                  </Card.Text>
                  <Button onClick ={()=> Navigate("/spayment")} variant="primary">View Details</Button>
                </Card.Body>
              </Card>
            </Col>

           
          </Row>
        </Container>
      </div>
      <br/>
      <br/>
      <div><Footer /></div>
    </>
    
  ); 
}

export default SupplierHome;