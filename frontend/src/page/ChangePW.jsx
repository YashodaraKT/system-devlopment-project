import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import '../css/ChangePW.css'; 
import Footer from '../component/Footer';


const ChangePW = () => {
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:8081/change-password',
        {
          username,
          currentPassword,
          newPassword,
        }
      );

      setStatus(response.data.status);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
    <Container className="mt-5">
    <Row className="justify-content-center align-items-center">
      <Col md={6} className="text-center">
        <img src={require('../assets/cpw.jpg')} alt="Background" className="img-fluid" />
      </Col>
      <Col md={6}>
        <div className="custom-form-container">
          <h2 className="mb-4">Change Password</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="username">
                <Form.Label>Username:</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="currentPassword">
                <Form.Label>Current Password:</Form.Label>
                <Form.Control
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="newPassword">
                <Form.Label>New Password:</Form.Label>
                <Form.Control
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Group>
              <br/>
             
              <Button variant="primary" type="submit" className="w-100">
                Change Password
              </Button>
            </Form>

            {status && <p className="mt-3">{status}</p>}
          </div>
        </Col>
      </Row>
    </Container>

    <br/><br/>
    <div><Footer /></div>
    </div>
  );

};

export default ChangePW;
