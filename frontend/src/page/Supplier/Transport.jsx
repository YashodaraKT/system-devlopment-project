import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfilenavBar from '../../component/ProfilenavBar'; // Ensure the path is correct
import { Button, Form, Table, Offcanvas, Alert } from 'react-bootstrap';
import moment from 'moment';

function Transport() {
  const [showScheduledAppointments, setShowScheduledAppointments] = useState(false);
  const [isPermanent, setIsPermanent] = useState(false);
  const [size, setSize] = useState('');
  const [startDate, setStartDate] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [supplierId, setSupplierId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

  const fetchSupplierId = async () => {
    try {
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        throw new Error('User not found in local storage');
      }
      const user = JSON.parse(userJson);
      const userId = user.User_ID;
      const response = await axios.get(`http://localhost:8081/supplier/${userId}`);
      const supplierId = response.data.supplierId;
      setSupplierId(supplierId);
    } catch (error) {
      console.error('Error fetching supplierId:', error);
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

  const handleCloseScheduledAppointments = () => setShowScheduledAppointments(false);
  const handleShowScheduledAppointments = () => setShowScheduledAppointments(true);

  const handlePermanentChange = (event) => {
    setIsPermanent(event.target.value === 'yes');
  };

  const handleSizeChange = (event) => {
    setSize(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/transport/request', {
        supplierId,
        isPermanent,
        size: isPermanent ? null : size,
        date: isPermanent ? null : startDate,
      });
      console.log(response.data);
      fetchSupplierAppointments();
      setSuccessMessage('Transport request submitted successfully!'); // Set success message
      setTimeout(() => setSuccessMessage(''), 3000); // Clear the success message after 3 seconds
      // Clear the form
      setIsPermanent(false);
      setSize('');
      setStartDate('');
    } catch (error) {
      console.error('Error submitting transport request:', error);
    }
  };

  return (
    <div>
      <div><ProfilenavBar userType="supplier"/></div>

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
      <div style={{ margin: 'auto', border: '2px solid black', padding: '20px', width: 'fit-content',fontSize:'20px' }}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicPermanent">
            <Form.Label>Are you requesting transport permanently?</Form.Label>
            <Form.Check
              type="radio"
              label="Yes"
              name="permanentTransport"
              value="yes"
              onChange={handlePermanentChange}
              checked={isPermanent}
            />
            <Form.Check
              type="radio"
              label="No"
              name="permanentTransport"
              value="no"
              onChange={handlePermanentChange}
              checked={!isPermanent}
            />
          </Form.Group>

          {!isPermanent && (
            <>
              <Form.Group className="mb-3" controlId="formBasicNumDays">
                <Form.Label>Approximate size of the Supply (kg)</Form.Label>
                <Form.Control type="number" placeholder="Enter the size" value={size} onChange={handleSizeChange} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicStartDate">
                <Form.Label>Relevant Date</Form.Label>
                <Form.Control type="date" placeholder="Select the date" value={startDate} onChange={handleStartDateChange} />
              </Form.Group>
            </>
          )}

          <Button variant="success" type="submit">
            Submit
          </Button>
        </Form>

        {successMessage && <Alert variant="success" style={{ marginTop: '20px' }}>{successMessage}</Alert>} {/* Success message */}

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
