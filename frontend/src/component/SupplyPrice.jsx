
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function NewPopup({ show, handleClose }) {

  const [priceWithoutTransport, setPriceWithoutTransport] = useState('');
  const [priceWithTransport, setPriceWithTransport] = useState('');

  useEffect(() => {
    const savedPriceWithoutTransport = localStorage.getItem('priceWithoutTransport');
    const savedPriceWithTransport = localStorage.getItem('priceWithTransport');

    if (savedPriceWithoutTransport) {
      setPriceWithoutTransport(savedPriceWithoutTransport);
    }

    if (savedPriceWithTransport) {
      setPriceWithTransport(savedPriceWithTransport);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('priceWithoutTransport', priceWithoutTransport);
    localStorage.setItem('priceWithTransport', priceWithTransport);
    console.log('Price without transport:', priceWithoutTransport);
    console.log('Price with transport:', priceWithTransport);
    handleClose();  // Close the modal after saving
  };



  return (
    <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>New Popup</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group controlId="priceWithoutTransport">
          <Form.Label>Price without transport</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter price without transport"
            value={priceWithoutTransport}
            onChange={(e) => setPriceWithoutTransport(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="priceWithTransport">
          <Form.Label>Price with transport</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter price with transport"
            value={priceWithTransport}
            onChange={(e) => setPriceWithTransport(e.target.value)}
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Close
      </Button>
      <Button variant="primary" onClick={handleSave}>
        Save Changes
      </Button>
    </Modal.Footer>
  </Modal>

  );
}

export default NewPopup;
