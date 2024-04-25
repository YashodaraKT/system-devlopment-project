import React, { useState } from 'react';
import ProfilenavBar from '../../component/ProfilenavBar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Offcanvas from 'react-bootstrap/Offcanvas';

function Orders() {
  const [showScheduleOrders, setShowScheduleOrders] = useState(false);
  

  const handleCloseScheduleOrders = () => setShowScheduleOrders(false);
  const handleShowScheduleOrders = () => setShowScheduleOrders(true);

  return (
    <div>
      <ProfilenavBar />
      <div style={{ marginLeft: '50px', padding: '20px', width: 'fit-content' }}>
        <h1>Orders</h1>
      </div>

      <div style={{ marginLeft: '60px', border: '1px solid black', padding: '20px', width: 'fit-content' }}>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicType">
            <Form.Label>Spice Type</Form.Label>
            <Form.Select aria-label="Default select example" >
              <option>Open this select menu</option>
              <option value="1">Cinnamon</option>
              <option value="2">Pepper</option>
              <option value="3">Cloves</option>
              <option value="2">Karunka</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicDate">
            <Form.Label>Date</Form.Label>
            <Form.Control type="Date" placeholder="Select the Date" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicTime">
            <Form.Label>Quantity</Form.Label>
            <Form.Control type="number" placeholder="Add the Quantity" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicTime">

            <Form.Label>Pre-Order Quantity</Form.Label>
            <Form.Control type="number" placeholder="Add the Quantity" />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
      <br />
      <br />

      <div style={{ display: 'inline-block' }}>
        <Button variant="info" onClick={handleShowScheduleOrders} style={{ marginRight: '30px', marginLeft: '60px' }}>View Schedule Orders</Button>
        
      </div>

      <Offcanvas show={showScheduleOrders} onHide={handleCloseScheduleOrders}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Schedule Orders</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          
        </Offcanvas.Body>
      </Offcanvas>
      
    </div>
  );
}

export default Orders;