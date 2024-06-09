import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';

function NewSupplyForm({ show, handleClose, fetchSupplierPayments, priceWithTransport, priceWithoutTransport }) {
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
    if (newSupply.Location_Id && newSupply.Transport) {
      const transportColumn = newSupply.Transport === '1' ? 'Price' : 'Price_WT';
      axios.get(`http://localhost:8081/location_price`, {
        params: {
          Location_Id: newSupply.Location_Id,
          Column: transportColumn
        }
      })
      .then(response => {
        setUnitPrice(response.data.unitPrice);
        setNewSupply(s => ({ ...s, Payment: response.data.unitPrice * s.Quantity }));
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
  };

  const handleAddSupply = async (e) => {
    e.preventDefault();
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
              type="number"
              name="Quantity"
              value={newSupply.Quantity}
              onChange={handleInputChange}
              required
            />
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
