import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfilenavBar from '../../component/ProfilenavBar';
import { Button, TextField, Typography, Alert } from '@mui/material';

function Transport() {
  const [showScheduledAppointments, setShowScheduledAppointments] = useState(false);
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
  const [transportStatus, setTransportStatus] = useState('');

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

    if (!startDate) {
      newErrors.startDate = 'Date is required';
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
      const response = await axios.post('http://localhost:8081/transport/req', {
        supplierId,
        date: startDate,
        description,
        agreement
      });
      console.log(response.data);
      fetchSupplierAppointments();
      setSuccessMessage('Transport request submitted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setStartDate('');
      setDescription('');
      setAgreement(false);
      setErrors({});
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrors({ submit: error.response.data });
      } else {
        console.error('Error submitting transport request:', error);
      }
    }
  };

  const getStatus = () => {
    if (transportStatus === '1') {
      return 'With Transport';
    } else {
      return 'Without Transport';
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div>
        <div><ProfilenavBar userType="supplier" /></div>

        <br />
        <br />
        <div style={{ margin: 'auto', border: '2px solid black', padding: '20px', width: '500px', fontSize: '20px' }}>
          <form onSubmit={handleSubmit}>
            <TextField style={{ marginBottom: '20px' }}
              label="Address"
              value={`${address1}, ${address2}`}
              fullWidth
              disabled
            />
            <TextField style={{ marginBottom: '20px' }}
              label="Location Name"
              value={locationName}
              fullWidth
              disabled
            />
            <TextField style={{ marginBottom: '20px' }}
              label="Current Status"
              value={getStatus()}
              fullWidth
              disabled
            />
            <TextField style={{ marginBottom: '20px' }}
              label="Beginning From *"
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              fullWidth
              required
              error={!!errors.startDate}
              helperText={errors.startDate}
            />
            <TextField style={{ marginBottom: '20px' }}
              label="Description"
              multiline
              rows={4}
              value={description}
              onChange={handleDescriptionChange}
              fullWidth
            />
            <div style={{ marginBottom: '20px' }}>
              <input style={{ marginRight: '10px' }}
                type="checkbox"
                checked={agreement}
                onChange={handleAgreementChange}
              />
              <Typography style={{ display: 'inline' }}>I agree with the price ranges</Typography>
            </div>
            {errors.agreement && <Alert severity="error">{errors.agreement}</Alert>}
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </form>

          {successMessage && <Alert severity="success" style={{ marginTop: '20px' }}>{successMessage}</Alert>}
          {errors.submit && <Alert severity="error" style={{ marginTop: '20px' }}>{errors.submit}</Alert>}

          <div style={{ marginTop: '20px' }}>
            <ul>
              <li>After confirming the transport, our drivers will contact you.</li>
              <li>Please ensure your supplies are prepared on time.</li>
              <li>Your payment will be reduced due to the transport costs.</li>
</ul>
</div>
</div>

  </div>
</div>
);
}

export default Transport;