import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

function UpdateSupplierModal({ show, onHide, supplier, fetchSuppliers }) {
  const [name, setName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [transport, setTransport] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize state with supplier data when modal is shown
    if (supplier) {
      setName(supplier.Name);
      setAddress1(supplier.Address1);
      setAddress2(supplier.Address2);
      setContactNumber(supplier.Contact_Number);
      setTransport(supplier.Transport);
    }
  }, [supplier]);

  const validateContactNumber = (number) => {
    const regex = /^0\d{9}$/;
    return regex.test(number);
  };

  const handleUpdate = async () => {
    if (!validateContactNumber(contactNumber)) {
      setError('Invalid mobile number');
      return;
    }

    try {
      await axios.put(`http://localhost:8081/updatesupplier/${supplier.Supplier_ID}`, {
        Name: name,
        Address1: address1,
        Address2: address2,
        Contact_Number: contactNumber,
        Transport: transport,
      });
      fetchSuppliers();
      onHide();
    } catch (error) {
      console.error('Error updating supplier:', error);
    }
  };

  const handleContactNumberChange = (e) => {
    const number = e.target.value;
    setContactNumber(number);
    if (validateContactNumber(number)) {
      setError(null);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Update Supplier</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
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
          <Form.Group controlId="formContactNumber">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              type="text"
              value={contactNumber}
              onChange={handleContactNumberChange}
              isInvalid={!!error}
            />
            <Form.Control.Feedback type="invalid">
              Contact number must start with 0 and be exactly 10 digits long.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formTransport">
            <Form.Label>Transport</Form.Label>
            <Form.Check
              type="checkbox"
              label="Yes"
              checked={transport === 1}
              onChange={(e) => setTransport(e.target.checked ? 1 : 0)}
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

export default UpdateSupplierModal;
