// AddMaterialForm.jsx
import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';

function AddMaterialForm({ show, handleClose, fetchRawMaterials }) {
  const [newMaterial, setNewMaterial] = useState({
    R_Name: '',
    Buying_Price: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMaterial({ ...newMaterial, [name]: value });
  };

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/rawmaterials', newMaterial);
      console.log('Material added:', response.data);
      fetchRawMaterials(); // Update the raw materials list after adding a new material
      handleClose(); // Close the modal after adding the material
    } catch (error) {
      console.error('Error adding material:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Material</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleAddMaterial}>
          <Form.Group controlId="R_Name">
            <Form.Label>R_Name</Form.Label>
            <Form.Control
              type="text"
              name="R_Name"
              value={newMaterial.R_Name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="Buying_Price">
            <Form.Label>Buying_Price</Form.Label>
            <Form.Control
              type="number"
              name="Buying_Price"
              value={newMaterial.Buying_Price}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Add Material
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddMaterialForm;
