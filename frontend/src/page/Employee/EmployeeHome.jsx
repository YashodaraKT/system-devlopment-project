import React from 'react';
import {Button, Container,Card,Row,Col} from 'react-bootstrap';
import h1Image from '../../assets/h1.png'; 
import ProfilenavBar from '../../component/ProfilenavBar';
import { useNavigate } from 'react-router-dom';


function EmployeeHome() {
  const Navigate= useNavigate();
  return (
    <>
       <div><ProfilenavBar/></div>

<br></br>
<br></br>
      <div className="d-flex justify-content-around">
        <Container>
          <Row>
            <Col xs={6} md={4}>
              <Card style={{ width: '18rem' }}>
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
              <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={h1Image} />
                <Card.Body>
                  <Card.Title>Supply</Card.Title>
                  <Card.Text>
                  Easily schedule appointments for delivering your goods to the factory.
                  </Card.Text>
                  <Button onClick ={()=> Navigate("/transport")} variant="primary">View Details</Button>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={6} md={4}>
              <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={h1Image} />
                <Card.Body>
                  <Card.Title>Product</Card.Title>
                  <Card.Text>
                  Easily schedule appointments for delivering your goods to the factory.
                  </Card.Text>
                  <Button onClick ={()=> Navigate("/transport")} variant="primary">View Details</Button>
                </Card.Body>
              </Card>
            </Col>
           </Row>
             <br/>
             <br/>

             <Row>
            <Col xs={6} md={4}>
              <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={h1Image} />
                <Card.Body>
                  <Card.Title> Supplier Payments</Card.Title>
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
    </>
  ); 
}

export default EmployeeHome;