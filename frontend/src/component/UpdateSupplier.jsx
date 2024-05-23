// UpdateSupplierModal.jsx
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

function UpdateSupplierModal({ show, onHide, supplier, fetchSuppliers, locations }) {
  const [contactNumber, setContactNumber] = useState(supplier.Contact_Number);
  const [transport, setTransport] = useState(supplier.Transport);

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8081/updatesupplier/${supplier.Supplier_ID}`, {
        Contact_Number: contactNumber,
        Transport: transport,
      });
      fetchSuppliers();
      onHide();
    } catch (error) {
      console.error('Error updating supplier:', error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Update Supplier</Modal.Title>
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
