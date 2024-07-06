import React, { useState, useEffect } from 'react';
import { Modal, Button, TextField, FormControlLabel, Checkbox, Typography } from '@mui/material';
import axios from 'axios';

function UpdateSupplierModal({ show, onHide, supplier, fetchSuppliers }) {
  const [name, setName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [transport, setTransport] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Initialize state with supplier data when modal is shown
    if (supplier) {
      setName(supplier.Name);
      setAddress1(supplier.Address1);
      setAddress2(supplier.Address2);
      setContactNumber(supplier.Contact_Number);
      setTransport(supplier.Transport === 1);
    }
  }, [supplier]);

  const validateContactNumber = (number) => {
    const regex = /^0\d{9}$/;
    return regex.test(number);
  };

  const validateName = (name) => {
    const regex = /^[a-zA-Z\s]{1,50}$/;
    return regex.test(name);
  };

  const validateAddress1 = (address) => {
    return address.length <= 70;
  };

  const validateAddress2 = (address) => {
    const regex = /^[a-zA-Z\s]{1,40}$/;
    return regex.test(address);
  };

  const handleUpdate = async () => {
    if (!validateName(name)) {
      setError('Name must be letters only and up to 50 characters.');
      return;
    }
    if (!validateAddress1(address1)) {
      setError('Address 1 must be up to 70 characters.');
      return;
    }
    if (!validateAddress2(address2)) {
      setError('Address 2 must be letters only and up to 40 characters.');
      return;
    }
    if (!validateContactNumber(contactNumber)) {
      setError('Contact number must start with 0 and be exactly 10 digits long.');
      return;
    }

    try {
      await axios.put(`http://localhost:8081/updatesupplier/${supplier.Supplier_ID}`, {
        Name: name,
        Address1: address1,
        Address2: address2,
        Contact_Number: contactNumber,
        Transport: transport ? 1 : 0,
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
      setError('');
    } else {
      setError('Invalid Mobile Number.');
    }
  };

  return (
    <Modal open={show} onClose={onHide}>
      <div style={{ margin: '20px', backgroundColor: 'white', padding: '20px' }}>
        <Typography variant="h6">Update Supplier</Typography>
        <TextField
          fullWidth
          label="Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!validateName(name)}
          helperText={!validateName(name) && 'Name must be letters only.'}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Address "
          variant="outlined"
          value={address1}
          onChange={(e) => setAddress1(e.target.value)}
          error={!validateAddress1(address1)}
          helperText={!validateAddress1(address1) && 'Address 1 must be up to 70 characters.'}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Nearest Town"
          variant="outlined"
          value={address2}
          onChange={(e) => setAddress2(e.target.value)}
          error={!validateAddress2(address2)}
          helperText={!validateAddress2(address2) && 'Nearest town must be letters only .'}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Contact Number"
          variant="outlined"
          value={contactNumber}
          onChange={handleContactNumberChange}
          error={!!error}
          helperText={error}
          margin="normal"
        />
        <FormControlLabel
          control={<Checkbox checked={transport} onChange={(e) => setTransport(e.target.checked)} />}
          label="Transport"
          style={{ marginTop: '10px' }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <Button variant="contained" color="secondary" onClick={onHide} style={{ marginRight: '10px' }}>
            Close
          </Button>
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Update
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default UpdateSupplierModal;
