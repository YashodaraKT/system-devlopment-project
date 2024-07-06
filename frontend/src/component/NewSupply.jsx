import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';

function NewSupplyForm({ show, handleClose, fetchSupplierPayments }) {
  const [newSupply, setNewSupply] = useState({
    Supplier_Name: '',
    Contact_Number: '',
    Quantity: '',
    Payment: '',
    Location_Id: '',
    Transport: ''
  });
  const [locations, setLocations] = useState([]);
  const [unitPrice, setUnitPrice] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get('http://localhost:8081/location')
      .then(response => {
        setLocations(response.data);
      })
      .catch(error => {
        console.error('Error fetching locations:', error);
      });
  }, []);

  useEffect(() => {
    if (newSupply.Location_Id && newSupply.Transport && newSupply.Quantity) {
      const transportColumn = newSupply.Transport === '1' ? 'Price' : 'Price_WT';
      axios.get(`http://localhost:8081/location_price`, {
        params: {
          Location_Id: newSupply.Location_Id,
          Column: transportColumn
        }
      })
      .then(response => {
        const price = response.data.unitPrice;
        setUnitPrice(price);
        setNewSupply(s => ({ ...s, Payment: price * s.Quantity }));
      })
      .catch(error => {
        console.error('Error fetching unit price:', error);
      });
    }
  }, [newSupply.Location_Id, newSupply.Transport, newSupply.Quantity]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSupply({
      ...newSupply,
      [name]: value
    });
    setErrors({
      ...errors,
      [name]: ''
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (newSupply.Supplier_Name.length > 50) {
      newErrors.Supplier_Name = 'Supplier name must be 50 characters or less';
    }
    if (!/^0\d{9}$/.test(newSupply.Contact_Number)) {
      newErrors.Contact_Number = 'Contact number must begin with 0 and be 10 digits long';
    }
    if (isNaN(newSupply.Quantity) || newSupply.Quantity <= 0) {
      newErrors.Quantity = 'Quantity must be a positive number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSupply = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const R_User_ID = userData ? userData.User_ID : null;
      const supplierResponse = await axios.get('http://localhost:8081/find_supplier', {
        params: {
          name: newSupply.Supplier_Name,
          contact: newSupply.Contact_Number
        }
      });

      if (supplierResponse.data.supplier) {
        const supplierId = supplierResponse.data.supplier.Supplier_ID;
        const transportStatus = newSupply.Transport === '1' ? 'With Transport' : 'Without Transport';
        const date = moment().format('YYYY-MM-DD');

        const newSupplyData = {
          Supplier_ID: supplierId,
          Quantity: newSupply.Quantity,
          Payment: newSupply.Payment,
          Date: date,
          R_User_ID: R_User_ID,
          Location_Id: newSupply.Location_Id,
          Transport_Status: transportStatus
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
              isInvalid={!!errors.Supplier_Name}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.Supplier_Name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="Contact_Number">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              type="text"
              name="Contact_Number"
              value={newSupply.Contact_Number}
              onChange={handleInputChange}
              isInvalid={!!errors.Contact_Number}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.Contact_Number}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="Quantity">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              name="Quantity"
              value={newSupply.Quantity}
              onChange={handleInputChange}
              isInvalid={!!errors.Quantity}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.Quantity}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="Location_Id">
            <Form.Label>Location</Form.Label>
            <Form.Control
              as="select"
              name="Location_Id"
              value={newSupply.Location_Id}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Select Location</option>
              {locations.map(location => (
                <option key={location.Location_Id} value={location.Location_Id}>
                  {location.Location_Name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="Transport">
            <Form.Label>Transport</Form.Label>
            <Form.Control
              as="select"
              name="Transport"
              value={newSupply.Transport}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Select Transport Option</option>
              <option value="1">With Transport</option>
              <option value="0">Without Transport</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="Payment">
            <Form.Label>Payment (LKR)</Form.Label>
            <Form.Control
              type="number"
              name="Payment"
              value={newSupply.Payment}
              readOnly
            />
          </Form.Group>
          <br/>
          <div className="d-flex justify-content-center">
            <Button variant="primary" type="submit">
              Add Supply
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default NewSupplyForm;
