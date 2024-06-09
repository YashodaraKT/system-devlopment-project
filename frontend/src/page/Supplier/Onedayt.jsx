import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfilenavBar from '../../component/ProfilenavBar';
import PendingAppS from '../../component/PendingAppS';
import FinalAppS from '../../component/FinalAppS';
import { Button, TextField, FormControlLabel, Checkbox, Alert, Tabs, Tab, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Card, CardContent, CardActions } from '@mui/material';
import moment from 'moment';

function Transport() {
  const [tabIndex, setTabIndex] = useState(0);
  const [showScheduledAppointments, setShowScheduledAppointments] = useState(false);
  const [size, setSize] = useState('');
  const [startDate, setStartDate] = useState('');
  const [description, setDescription] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [supplierId, setSupplierId] = useState(null);
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [locationId, setLocationId] = useState('');
  const [locationName, setLocationName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [agreement, setAgreement] = useState(false);

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  const handleShowScheduledAppointments = () => setShowScheduledAppointments(true);
  const handleCloseScheduledAppointments = () => setShowScheduledAppointments(false);

  const fetchSupplierId = async () => {
    try {
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        throw new Error('User not found in local storage');
      }
      const user = JSON.parse(userJson);
      const userId = user.User_ID;
      const response = await axios.get(`http://localhost:8081/transport_supplier/${userId}`);
      const { supplierId, address, locationId } = response.data;
      const { address1, address2 } = address;
      setSupplierId(supplierId);
      setAddress1(address1);
      setAddress2(address2);
      setLocationId(locationId);
    } catch (error) {
      console.error('Error fetching supplier data:', error);
    }
  };

  useEffect(() => {
    fetchSupplierId();
  }, []);

  const fetchSupplierAppointments = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/appointment/${supplierId}`);
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  useEffect(() => {
    if (supplierId) {
      fetchSupplierAppointments();
    }
  }, [supplierId]);

  const fetchLocationName = async () => {
    try {
      const response = await axios.get('http://localhost:8081/location');
      const location = response.data.find(location => location.Location_Id === locationId);
      if (location) {
        setLocationName(location.Location_Name);
      }
    } catch (error) {
      console.error('Error fetching location name:', error);
    }
  };

  useEffect(() => {
    if (locationId) {
      fetchLocationName();
    }
  }, [locationId]);

  const handleSizeChange = (event) => {
    setSize(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleAgreementChange = (event) => {
    setAgreement(event.target.checked);
  };

  const validate = () => {
    const newErrors = {};
    if (!size) {
      newErrors.size = 'Size is required';
    } else if (parseFloat(size) <= 20) {
      newErrors.size = 'Size must be greater than 20kg';
    }
    if (!startDate) {
      newErrors.startDate = 'Date is required';
    } else {
      const selectedDate = moment(startDate);
      const today = moment().startOf('day');
      const maxDate = moment().add(7, 'days').startOf('day');
      if (!selectedDate.isAfter(today) || selectedDate.isAfter(maxDate)) {
        newErrors.startDate = 'Date must be within the next 7 days and cannot be today';
      }
    }
    if (!agreement) {
      newErrors.agreement = 'You must agree to our price ranges';
    }
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const response = await axios.post('http://localhost:8081/transport/request', {
        supplierId,
        size,
        date: startDate,
        description,
        agreement
      });
      console.log(response.data);
      fetchSupplierAppointments();
      setSuccessMessage('Transport request submitted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setSize('');
      setStartDate('');
      setDescription('');
      setAgreement(false);
      setErrors({});
    } catch (error) {
      console.error('Error submitting transport request:', error);
    }
  };

  return (
    <div>
      <ProfilenavBar userType="supplier" />

      <Box sx={{ width: '100%', typography: 'body1', mt: 2 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} sx={{ justifyContent: 'flex-start' }}>
          <Tab label="Transport" />
          <Tab label="Pending" />
          <Tab label="Completed and Rejected" />
        </Tabs>

        {tabIndex === 0 && (
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
            <Card variant="outlined" sx={{ width: '500px' }}>
              <CardContent>

                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={`${address1}, ${address2}`}
                    InputProps={{ readOnly: true }}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Location Name"
                    value={locationName}
                    InputProps={{ readOnly: true }}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    type="number"
                    label="Approximate size of the Supply (kg)"
                    value={size}
                    onChange={handleSizeChange}
                    error={!!errors.size}
                    helperText={errors.size}
                    margin="normal"
                    inputProps={{ min: 21 }}
                  />
                  <TextField
                    fullWidth
                    type="date"
                    label="Relevant Date"
                    InputLabelProps={{ shrink: true }}
                    value={startDate}
                    onChange={handleStartDateChange}
                    error={!!errors.startDate}
                    helperText={errors.startDate}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    multiline
                    label="Description"
                    value={description}
                    onChange={handleDescriptionChange}
                    margin="normal"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={agreement}
                        onChange={handleAgreementChange}
                        color="primary"
                      />
                    }
                    label="I agree with the price ranges"
                  />
                  {errors.agreement && <Typography color="error">{errors.agreement}</Typography>}
                  <Button variant="contained" color="success" type="submit" fullWidth sx={{ mt: 2 }}>
                    Submit
                  </Button>
                </form>

                {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}

                <Box sx={{ mt: 2 }}>
                  <ul>
                    <li>After confirming the transport, our drivers will contact you.</li>
                    <li>Please ensure your supplies are prepared on time.</li>
                    <li>Your payment will be reduced due to the transport costs.</li>
                  </ul>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

{tabIndex === 1 && (
  <div>
    <PendingAppS/>
  </div>
)}
{tabIndex === 2 && (
  <div>
    <FinalAppS/>
  </div>
)}

      </Box>
    </div>
  );
}

export default Transport;
