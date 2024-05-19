import React, { useState } from 'react';
import { Button, Col, Form, Row, Container } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminBar from '../../component/AdminBar';

function SupRegister() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [transport, setTransport] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Form validation: Check if any field is blank
    if (!userName || !password || !name || !contactNumber || !address1 || !address2 || !transport) {
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
          User_ID: userId
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
  };
    return (
        <div>
               <div><AdminBar/></div>
            <br />
            <br />
            <br />
            <div style={{ textAlign: 'center' }}>
                <h1>Register Supplier</h1>
            </div>
            <br />
            <br />
            <Container className="cus-register-form-container">
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
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridAddress1">
                            <Form.Label>Village</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Wadduwa"
                                value={address1}
                                onChange={(e) => setAddress1(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridAddress2">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Kalutara"
                                value={address2}
                                onChange={(e) => setAddress2(e.target.value)}
                            />
                        </Form.Group>
                    </Row>
                    
                    <Form.Group className="mb-3" id="formGridName">
                    <Form.Label>Transport</Form.Label>
  <Form.Select
    value={transport}
    onChange={(e) => setTransport(e.target.value === "1" ? 1 : 0)}
  >
    <option value="">Select an option</option>
    <option value="1">Yes</option>
    <option value="0">No</option>
  </Form.Select>
</Form.Group>
                    
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
                </Container>  
      <ToastContainer />
           
        </div>
    );
}

export default SupRegister;
