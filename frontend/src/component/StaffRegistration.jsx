import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Modal, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function StaffRegistration(props) {

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [contactNumber, setContactNumber] = useState('');


    const handleSubmit = async (event) => {
        event.preventDefault();


        // Form validation: Check if any field is blank
        if (!userName || !password || !name || !contactNumber) {
            toast.error("Please fill in all fields."); // Display error notification
            return; // Exit function if any field is blank
        }


        try {
            // Send a POST request to create a new user
            const userResponse = await axios.post('http://localhost:8081/user', {
                User_Name: userName,
                User_Type: 'Employee',
                Password: password,
            });

            // Extract the User_ID from the response
            const userId = userResponse.data.User_ID;

            // Send a POST request to create a new supplier, with the retrieved User_ID
            const staffResponse = await axios.post('http://localhost:8081/staff', {
                Name: name,
                Contact_Number: contactNumber,
                User_ID: userId
            });

            // Show success notification
            toast.success("Staff member registered successfully!");

            // Clear form fields
            clearForm();
        } catch (error) {
            // Show error notification
            toast.error("Error registering Staff member. Please try again.");
            console.error('Error:', error.response.data);
        }
    };

    const clearForm = () => {
        setUserName('');
        setPassword('');
        setName('');
        setContactNumber('');
    };

    const ref = useRef();
  useEffect(() => {
    const handler = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        props.onHide();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, []);


  return (
    <Modal
    {...props}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
  >
    <Modal.Header>
      <Modal.Title id="contained-modal-title-vcenter">
        Register Staff
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Container className="cus-register-form-container" ref={ref}>
        <Form className="cus-register-form" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" id="formGridName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter name with surname"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridUserName">
                            <Form.Label>UserName</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter UserName"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" id="formGridName">
                        <Form.Label>Contact Number</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter the contact number"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                        />
                    </Form.Group>
                    </Row>
               
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
                </Container>
    
                <ToastContainer />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default StaffRegistration;
