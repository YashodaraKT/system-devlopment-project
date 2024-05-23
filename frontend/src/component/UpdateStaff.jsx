// UpdateContactNumberModal.jsx
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

function UpdateContactNumberModal({ show, onHide, staffId, currentContact, fetchStaff }) {
  const [newContact, setNewContact] = useState(currentContact);

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8081/updatestaffcontact/${staffId}`, {
        Contact_Number: newContact,
      });
      fetchStaff();
      onHide();
    } catch (error) {
      console.error('Error updating contact number:', error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Update Contact Number</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formContactNumber">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              type="text"
              value={newContact}
              onChange={(e) => setNewContact(e.target.value)}
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

export default UpdateContactNumberModal;
