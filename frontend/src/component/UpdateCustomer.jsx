// UpdateCustomerModal.jsx
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

function UpdateCustomerModal({ show, onHide, customer, fetchCustomers }) {
  const [contactNumber, setContactNumber] = useState(customer.Contact_Number);

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8081/updatecustomer/${customer.Customer_ID}`, {
        Contact_Number: contactNumber,
      });
      fetchCustomers();
      onHide();
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Update Customer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formContactNumber">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              type="text"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleUpdate}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UpdateCustomerModal;
