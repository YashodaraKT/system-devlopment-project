// UpdateCustomerModal.jsx
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

function UpdateCustomerModal({ show, onHide, customer, fetchCustomers }) {
  const [name, setName] = useState(customer.Name);
  const [address1, setAddress1] = useState(customer.Address1);
  const [address2, setAddress2] = useState(customer.Address2);
  const [email, setEmail] = useState(customer.Email);
  const [contactNumber, setContactNumber] = useState(customer.Contact_Number);

  const handleUpdate = async () => {
    try {
      // Validation checks before updating
      if (!validateContactNumber(contactNumber)) {
        alert('Invalid contact number format. It must start with 0 and be 10 digits long.');
        return;
      }
      if (address1.length > 70) {
        alert('Address 1 exceeds maximum length of 70 characters.');
        return;
      }
      if (!/^[a-zA-Z\s]+$/.test(address2) || address2.length > 30) {
        alert('Address 2 must contain letters only and be maximum 30 characters long.');
        return;
      }
      if (!validateEmail(email)) {
        alert('Invalid email format.');
        return;
      }

      // If all validations pass, proceed with update
      await axios.put(`http://localhost:8081/updatecustomer/${customer.Customer_ID}`, {
        Name: name,
        Address1: address1,
        Address2: address2,
        Email: email,
        Contact_Number: contactNumber,
      });
      fetchCustomers();
      onHide();
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const validateContactNumber = (number) => {
    const regex = /^0\d{9}$/; // Must start with 0 and be 10 digits long
    return regex.test(number);
  };

  const validateEmail = (email) => {
    // Standard email validation regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Update Customer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formAddress1">
            <Form.Label>Address 1</Form.Label>
            <Form.Control
              type="text"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formAddress2">
            <Form.Label>Address 2</Form.Label>
            <Form.Control
              type="text"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
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
