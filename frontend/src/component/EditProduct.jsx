import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

function EditProductModal({ show, onHide, product, fetchProducts }) {
  
  const [cost, setCost] = useState(product.Cost);
  const [sellingPrice, setSellingPrice] = useState(product.Selling_Price);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:8081/updateProduct/${product.Product_ID}`, {
    
        Cost: cost,
        Selling_Price: sellingPrice
      });
      fetchProducts(); // Fetch updated list of products
      onHide(); // Close the modal
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleFormSubmit}>
          
          <Form.Group controlId="cost">
            <Form.Label>Cost</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter cost"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="sellingPrice">
            <Form.Label>Selling Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter selling price"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Update
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditProductModal;
