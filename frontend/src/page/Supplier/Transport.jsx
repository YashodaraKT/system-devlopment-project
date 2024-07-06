import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SupplierNBar from '../../component/SupplierNBar';
import { Button, Form, Alert, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div>
      <div><SupplierNBar userType="supplier" /></div>

      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <Row>
            <Col>
              <div className="border p-4" style={{ width: '600px', fontSize: '20px' }}>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      value={`${address1}, ${address2}`}
                      disabled
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Location Name</Form.Label>
                    <Form.Control
                      value={locationName}
                      disabled
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Current Status</Form.Label>
                    <Form.Control
                      value={getStatus()}
                      disabled
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Beginning From *</Form.Label>
                    <Form.Control
                      type="date"
                      value={startDate}
                      onChange={handleStartDateChange}
                      required
                      isInvalid={!!errors.startDate}
                    />
                    <Form.Control.Feedback type="invalid">{errors.startDate}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={description}
                      onChange={handleDescriptionChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
  <Form.Check
    type="checkbox"
    label={<span style={{ fontSize: '16px' }}>I agree with the price ranges</span>}
    checked={agreement}
    onChange={handleAgreementChange}
    isInvalid={!!errors.agreement}
  />
                    <Form.Control.Feedback type="invalid">{errors.agreement}</Form.Control.Feedback>
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </Form>

                {successMessage && <Alert variant="success" className="mt-3">{successMessage}</Alert>}
                {errors.submit && <Alert variant="danger" className="mt-3">{errors.submit}</Alert>}
              </div>
            </Col>
            <Col>
  <div className="border p-4" style={{ width: '400px', fontSize: '15px' }}>
    <div className="mt-3">
      <p>Dear valued supplier,</p>
      <p>If you have changed the transport status within the last 30 days, you can submit a new request.</p>
      <p>After confirming the transport, our drivers will contact you. Please ensure your supplies are prepared on time. Note that your payment will be reduced to account for the transport costs.</p>
      <p>Thank you for your cooperation.</p>
      <p>Manager</p>
      <p>Moro Farms (pvt)Ltd</p>
    </div>
  </div>
</Col>

          </Row>
        </div>
      </Container>
    </div>
  );
}

export default Transport;
