// SupplierRegistrationForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Container, TextField, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SupplierRegistrationForm = ({ show, onHide, fetchSuppliers }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [transport, setTransport] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchLocationData();
  }, []);

  const fetchLocationData = async () => {
    try {
      const response = await axios.get('http://localhost:8081/location');
      if (response.status >= 200 && response.status < 300) {
        setLocations(response.data);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Failed to fetch locations. Please try again later.');
    }
  };

  const validateForm = () => {
    const nameRegex = /^[A-Za-z\s]{1,50}$/;
    const address1Regex = /^.{1,40}$/;
    const address2Regex = /^[A-Z][a-zA-Z\s]{0,24}$/;
    const contactNumberRegex = /^0\d{9}$/;
    const userNameRegex = /^[a-zA-Z0-9]{1,15}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,15}$/;

    if (!name.match(nameRegex)) {
      toast.error("Name must be letters only and up to 50 characters.");
      return false;
    }
    if (!address1.match(address1Regex)) {
      toast.error("Address must be up to 40 characters.");
      return false;
    }
    if (!address2.match(address2Regex)) {
      toast.error("Nearest Town must be up to 25 characters, start with a capital letter, and contain only letters.");
      return false;
    }
    if (!contactNumber.match(contactNumberRegex)) {
      toast.error("Contact number must start with 0 and be exactly 10 digits.");
      return false;
    }
    if (!userName.match(userNameRegex)) {
      toast.error("Username must be up to 15 characters long and can contain letters and numbers.");
      return false;
    }
    if (!password.match(passwordRegex)) {
      toast.error("Password must be 8-15 characters long, contain at least one letter and one number.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Example of how you might handle form submission
      const userResponse = await axios.post('http://localhost:8081/user', {
        User_Name: userName,
        User_Type: 'Supplier',
        Password: password,
      });

      if (userResponse.status >= 200 && userResponse.status < 300) {
        const userId = userResponse.data.User_ID;

        const supplierResponse = await axios.post('http://localhost:8081/supplier', {
          Name: name,
          Contact_Number: contactNumber,
          Address1: address1,
          Address2: address2,
          Transport: transport,
          Location_Id: selectedLocation,
          User_ID: userId,
          R_User_ID: userId
        });

        if (supplierResponse.status >= 200 && supplierResponse.status < 300) {
          toast.success("Supplier registered successfully!");
          clearForm();
          fetchSuppliers(); // Refresh suppliers list
          onHide(); // Close modal or perform any other necessary action
        } else {
          toast.error("Error registering supplier. Please try again.");
        }
      } else {
        toast.error("Error registering user. Please try again.");
      }
    } catch (error) {
      toast.error("Error registering supplier. Please try again.");
      console.error('Error:', error.response.data);
    }
  };

  const clearForm = () => {
    setUserName('');
    setPassword('');
    setName('');
    setAddress1('');
    setAddress2('');
    setContactNumber('');
    setTransport('');
    setSelectedLocation('');
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="password"
              label="Password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Address"
              variant="outlined"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Nearest Town"
              variant="outlined"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Contact Number"
              variant="outlined"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Transport</InputLabel>
              <Select
                value={transport}
                onChange={(e) => setTransport(e.target.value)}
                label="Transport"
                required
              >
                <MenuItem value="">
                  <em>Select an option</em>
                </MenuItem>
                <MenuItem value="1">Yes</MenuItem>
                <MenuItem value="0">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Location</InputLabel>
              <Select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                label="Location"
                required
              >
                <MenuItem value="">
                  <em>Select a location</em>
                </MenuItem>
                {locations.map((location) => (
                  <MenuItem key={location.Location_Id} value={location.Location_Id}>
                    {location.Location_Name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default SupplierRegistrationForm;
