import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function SupplyPrice({
  show,
  handleClose,
  setPriceWithTransport,
  setPriceWithoutTransport,
  priceWithoutTransport,
  priceWithTransport,
}) {
  const handleSave = () => {
    localStorage.setItem('priceWithoutTransport', priceWithoutTransport);
    localStorage.setItem('priceWithTransport', priceWithTransport);
    setPriceWithoutTransport(priceWithoutTransport);
    setPriceWithTransport(priceWithTransport);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Supply Prices</Modal.Title>
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

export default SupplyPrice;
