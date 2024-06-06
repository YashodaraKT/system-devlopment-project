import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfilenavBar from '../../component/ProfilenavBar';
import { Button, Form, Table, Offcanvas, Alert } from 'react-bootstrap';
import moment from 'moment';

function Transport() {
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
      <div><ProfilenavBar userType="supplier" /></div>

      <div style={{ textAlign: 'center' }}>
        <h1>Transport</h1>
      </div>
      <div style={{ marginLeft: '50px', display: 'inline-block' }}>
        <Button variant="info" onClick={handleShowScheduledAppointments} style={{ marginLeft: '315px' }}>
          Appointments
        </Button>
      </div>

      <br />
      <br />
      <div style={{ margin: 'auto', border: '2px solid black', padding: '20px', width: 'fit-content', fontSize: '20px' }}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control type="text" value={`${address1}, ${address2}`} readOnly />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicLocationId">
            <Form.Label>Location Name</Form.Label>
            <Form.Control type="text" value={locationName} readOnly />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicNumDays">
            <Form.Label>Approximate size of the Supply (kg) <span style={{ color: 'red' }}>*</span></Form.Label>
            <Form.Control 
              type="number" 
              placeholder="Enter the size" 
              value={size} 
              onChange={handleSizeChange}
              isInvalid={!!errors.size}
              min="21"
              style={{ 
                appearance: 'textfield',
                WebkitAppearance: 'none',
                MozAppearance: 'none'
              }}
            />
            <Form.Control.Feedback type="invalid">
              {errors.size}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicStartDate">
            <Form.Label>Relevant Date <span style={{ color: 'red' }}>*</span></Form.Label>
            <Form.Control 
              type="date" 
              placeholder="Select the date" 
              value={startDate} 
              onChange={handleStartDateChange}
              isInvalid={!!errors.startDate}
            />
            <Form.Control.Feedback type="invalid">
              {errors.startDate}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control 
              as="textarea" 
              placeholder="Enter description" 
              value={description} 
              onChange={handleDescriptionChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicAgreement">
  <Form.Check 
    type="checkbox" 
    label={<span style={{ fontSize: '0.8em' }}>I agree with the price ranges</span>} 
    checked={agreement}
    onChange={handleAgreementChange}
    isInvalid={!!errors.agreement}
  />
  <Form.Control.Feedback type="invalid">
    {errors.agreement}
  </Form.Control.Feedback>
</Form.Group>
          <Button variant="success" type="submit">
            Submit
          </Button>
        </Form>

        {successMessage && <Alert variant="success" style={{ marginTop: '20px' }}>{successMessage}</Alert>}

        <div style={{ marginTop: '20px' }}>
          <ul>
            <li>After confirming the transport, our drivers will contact you.</li>
            <li>Please ensure your supplies are prepared on time.</li>
            <li>Your payment will be reduced due to the transport costs.</li>
          </ul>
        </div>
      </div>

      <Offcanvas show={showScheduledAppointments} onHide={handleCloseScheduledAppointments}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Scheduled Appointments</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Appointment ID</th>
                <th>Date</th>
                <th>Size</th>
                <th>Approval</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.Appointment_ID}>
                  <td>{appointment.Appointment_ID}</td>
                  <td>{moment(appointment.Date).format('MM/DD/YYYY')}</td>
                  <td>{appointment.Size}</td>
                  <td>{appointment.Approval === 1 ? 'Approved' : appointment.Approval === 10 ? 'Pending' : appointment.Approval === 0 ? 'Declined' : ''}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default Transport;
