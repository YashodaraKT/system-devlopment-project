import React, { useState, useEffect } from 'react';
import { Button, Container, TextField, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SupplierRegistrationPage() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [transport, setTransport] = useState('');
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');

  const fetchLocationData = async () => {
    try {
      const response = await axios.get('http://localhost:8081/location');
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      }
    } catch (error) {
      console.error('Error:', error);
    }
    return [];
  };

  useEffect(() => {
    const fetchData = async () => {
      const locationData = await fetchLocationData();
      setLocations(locationData);
    };
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Form validation: Check if any field is blank
    if (!userName || !password || !name || !contactNumber || !address1 || !address2 || !transport || !selectedLocation) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      // Send a POST request to create a new user
      const userResponse = await axios.post('http://localhost:8081/user', {
        User_Name: userName,
        User_Type: 'Supplier',
        Password: password,
      });

      if (userResponse.status >= 200 && userResponse.status < 300) {
        // Extract the User_ID from the response
        const userId = userResponse.data.User_ID;

        // Send a POST request to create a new supplier, with the retrieved User_ID
        const supplierResponse = await axios.post('http://localhost:8081/supplier', {
          Name: name,
          Contact_Number: contactNumber,
          Address1: address1,
          Address2: address2,
          Transport: transport,
          Location_Id: selectedLocation,
          User_ID: userId,
          R_User_ID: userId // Assuming this should be the same as User_ID
        });

        // Show success notification
        toast.success("Supplier registered successfully!");

        // Clear form fields
        clearForm();
      } else {
        toast.error("Error registering user. Please try again.");
      }
    } catch (error) {
      // Show error notification
      toast.error("Error registering supplier. Please try again.");
      console.error('Error:', error.response.data);
    }
  };

  const clearForm = () => {
    setUserName('');
    setPassword('');
    setName('');
    setContactNumber('');
    setAddress1('');
    setAddress2('');
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
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="UserName"
              variant="outlined"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
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
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Village"
              variant="outlined"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="City"
              variant="outlined"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Contact Number"
              variant="outlined"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Transport</InputLabel>
              <Select
                value={transport}
                onChange={(e) => setTransport(e.target.value)}
                label="Transport"
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
      <ToastContainer />
    </Container>
  );
}

export default SupplierRegistrationPage;
