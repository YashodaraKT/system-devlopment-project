import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfilenavBar from '../../component/ProfilenavBar';
import {Button,Form,Table,Offcanvas} from 'react-bootstrap';
import moment from 'moment';


function Transport() {
  const [showScheduledAppointments, setShowScheduledAppointments] = useState(false);
  const [locations, setLocations] = useState([]);
  const [isPermanent, setIsPermanent] = useState(false);
  const [numDays, setNumDays] = useState('');
  const [startDate, setStartDate] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [supplierId, setSupplierId] = useState(null);


  const fetchSupplierId = async () => {
    try {
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        throw new Error('User not found in local storage');
      }
      console.log('User JSON:', userJson);
      const user = JSON.parse(userJson);
      console.log('Parsed User:', user);
      const userId = user.User_ID;
      const response = await axios.get(`http://localhost:8081/supplier/${userId}`);
      console.log('appointments data:', response.data);
      const supplierId = response.data.supplierId; // Update this line
      console.log('Supplier ID:', supplierId);
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
      console.log('appointments data:', response.data); // Add this line
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



  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://localhost:8081/location');
        setLocations(response.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  const handleCloseScheduledAppointments = () => setShowScheduledAppointments(false);
  const handleShowScheduledAppointments = () => setShowScheduledAppointments(true);

  const handlePermanentChange = (event) => {
    setIsPermanent(event.target.checked);
  };
  const handleNumDaysChange = (event) => {
    setNumDays(event.target.value);
  };
  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
  };



  return (
    <div>
      <ProfilenavBar />
      <div style={{ marginLeft: '50px', padding: '20px', width: 'fit-content' }}>
        <h1>Transport</h1>
      </div>
      <div style={{ marginLeft: '50px', display: 'inline-block' }}>
        <Button variant="success" onClick={handleShowScheduledAppointments} style={{ marginLeft: '20px' }}>
          Appointments
        </Button>
      </div>
     
      <br />
      <br />
      <div style={{ marginLeft: '60px', border: '1px solid black', padding: '20px', width: 'fit-content' }}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicType">
            <Form.Label>Location</Form.Label>
            <Form.Select aria-label="Default select example">
              <option>Select the Location</option>
              {locations.map((location) => (
                <option key={location.Location_Id} value={location.Location_Name}>
                  {location.Location_Name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicTime">
            <Form.Label>Address</Form.Label>
            <Form.Control type="Text" placeholder="Enter the Address" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPermanent">
          <Form.Label>Are you requesting transport permanently?</Form.Label>
            <Form.Check
              type="checkbox"
              label="No"
              onChange={handlePermanentChange}
            />
          </Form.Group>

          {isPermanent && (
            <>
              <Form.Group className="mb-3" controlId="formBasicNumDays">
                <Form.Label>No of Days</Form.Label>
                <Form.Control type="number" placeholder="Enter the Number" value={numDays} onChange={handleNumDaysChange} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicStartDate">
                <Form.Label>Start Date</Form.Label>
                <Form.Control type="date" placeholder="Select the Date" value={startDate} onChange={handleStartDateChange} />
              </Form.Group>
            </>
          )}

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>

      <Offcanvas show={showScheduledAppointments} onHide={handleCloseScheduledAppointments}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Available Locations</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
  <Table striped bordered hover>
    <thead>
      <tr>
        <th>Appointment ID</th>
        <th>Date</th>
        <th>No. of Days</th>
        <th>Approval</th>
      </tr>
    </thead>
    <tbody>
      {appointments.map((appointment) => (
        <tr key={appointment.Appointment_ID}>
          <td>{appointment.Appointment_ID}</td>
          <td>{moment(appointment.Date).format('MM/DD/YYYY')}</td>
          <td>{appointment.No_of_Days}</td>
          <td><td>{appointment.Approval === 1 ? 'Approved' : appointment.Approval === 10 ? 
          'Pending' : appointment.Approval === 0 ? 'Declined' : ''}</td>
</td>
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
