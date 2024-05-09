import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfilenavBar from '../../component/ProfilenavBar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Offcanvas from 'react-bootstrap/Offcanvas';

function Transport() {
  const [showScheduledAppointments, setShowScheduledAppointments] = useState(false);
  const [locations, setLocations] = useState([]);

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

  return (
    <div>
      <ProfilenavBar />
      <div style={{ marginLeft: '50px', padding: '20px', width: 'fit-content' }}>
        <h1>Transport</h1>
      </div>
      <div style={{ marginLeft: '50px', display: 'inline-block' }}>
        <Button variant="success" onClick={handleShowScheduledAppointments} style={{ marginLeft: '20px' }}>
          Location Areas
        </Button>
      </div>

      <br />
      <br />
      <div style={{ marginLeft: '60px', border: '1px solid black', padding: '20px', width: 'fit-content' }}>
        <Form>
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

          <Form.Group className="mb-3" controlId="formBasicDate">
            <Form.Label>Date</Form.Label>
            <Form.Control type="Date" placeholder="Select the Date" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicTime">
            <Form.Label>No of Days</Form.Label>
            <Form.Control type="number" placeholder="Enter the Number" />
          </Form.Group>

          {/* Rest of the form */}

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
          {/* Display scheduled appointments here */}
          <p>This section will display Location IDs and Name</p>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default Transport;
