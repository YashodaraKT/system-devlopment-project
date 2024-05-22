import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';

function NewSupplyForm({ show, handleClose, fetchSupplierPayments }) {
  const [newSupply, setNewSupply] = useState({
    Supplier_Name: '',
    Contact_Number: '',
    Quantity: '',
    Payment: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSupply({
      ...newSupply,
      [name]: value
    });
  };

  const handleAddSupply = async (e) => {
    e.preventDefault();
    try {
      const supplierResponse = await axios.get('http://localhost:8081/find_supplier', {
        params: {
          name: newSupply.Supplier_Name,
          contact: newSupply.Contact_Number
        }
      });

      if (supplierResponse.data.supplier) {
        const supplierId = supplierResponse.data.supplier.Supplier_ID;
        const date = moment().format('YYYY-MM-DD');
        const newSupplyData = {
          Supplier_ID: supplierId,
          Quantity: newSupply.Quantity,
          Payment: newSupply.Payment,
          Date: date
        };

        const addSupplyResponse = await axios.post('http://localhost:8081/add_supply', newSupplyData);
        console.log('Supply added:', addSupplyResponse.data);
        fetchSupplierPayments();
        handleClose();
      } else {
        console.error('Supplier not found');
      }
    } catch (error) {
      console.error('Error adding new supply:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Supply</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleAddSupply}>
          <Form.Group controlId="Supplier_Name">
            <Form.Label>Supplier Name</Form.Label>
            <Form.Control
              type="text"
              name="Supplier_Name"
              value={newSupply.Supplier_Name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="Contact_Number">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              type="text"
              name="Contact_Number"
              value={newSupply.Contact_Number}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="Quantity">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="text"
              name="Quantity"
              value={newSupply.Quantity}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="Payment">
            <Form.Label>Payment (LKR)</Form.Label>
            <Form.Control
              type="text"
              name="Payment"
              value={newSupply.Payment}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Add Supply
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default NewSupplyForm;
