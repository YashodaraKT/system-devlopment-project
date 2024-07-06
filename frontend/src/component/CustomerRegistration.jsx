import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Modal, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CustomerRegistration(props) {

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');

    const validateForm = () => {
        const nameRegex = /^[a-zA-Z\s]{1,50}$/;
        const address1Regex = /^.{1,70}$/;
        const address2Regex = /^[a-zA-Z\s]{1,50}$/;
        const contactNumberRegex = /^0\d{9}$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        const userNameRegex = /^[a-zA-Z0-9]{1,15}$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/;

        if (!name.match(nameRegex)) {
            toast.error("Name must be letters only and up to 50 characters.");
            return false;
        }
        if (!address1.match(address1Regex)) {
            toast.error("Address1 must be up to 70 characters.");
            return false;
        }
        if (!address2.match(address2Regex)) {
            toast.error("City must be letters only and up to 50 characters.");
            return false;
        }
        if (!contactNumber.match(contactNumberRegex)) {
            toast.error("Contact number must be exactly 10 digits and start with 0.");
            return false;
        }
        if (!email.match(emailRegex)) {
            toast.error("Email must be valid and use @gmail.com domain.");
            return false;
        }
        if (!userName.match(userNameRegex)) {
            toast.error("Username must not be empty and can contain letters and numbers, up to 15 characters.");
            return false;
        }
        if (!password.match(passwordRegex)) {
            toast.error("Password must be 8-12 characters long, contain at least one letter and one number.");
            return false;
        }

        return true;
    };

    const checkUserNameExists = async (userName) => {
        try {
            const response = await axios.get(`http://localhost:8081/user?UserName=${userName}`);
            return response.data.exists;
        } catch (error) {
            console.error('Error checking username:', error);
            return true; // Assume the username exists if there's an error checking
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const userNameExists = await checkUserNameExists(userName);
        if (userNameExists) {
            toast.error("Username already exists. Please choose another.");
            return;
        }

        try {
            // Send a POST request to create a new user
            const userResponse = await axios.post('http://localhost:8081/user', {
                User_Name: userName,
                User_Type: 'Customer',
                Password: password,
            });

            // Extract the User_ID from the response
            const userId = userResponse.data.User_ID;

            // Send a POST request to create a new customer, with the retrieved User_ID
            const customerResponse = await axios.post('http://localhost:8081/customer', {
                Name: name,
                Contact_Number: contactNumber,
                Address1: address1,
                Address2: address2,
                Email: email,
                User_ID: userId
            });

            // Show success notification
            toast.success("Customer registered successfully!");

            // Clear form fields
            clearForm();
        } catch (error) {
            // Show error notification
            toast.error("Error registering customer. Please try again.");
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
        setEmail('');
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
                    Register Customer
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container className="cus-register-form-container" ref={ref}>
                    <Form className="cus-register-form" onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" id="formGridName">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter name with surname"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Group>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridUserName">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter username"
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
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridContactNumber">
                                <Form.Label>Contact Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter contact number"
                                    value={contactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter village"
                                    value={address1}
                                    onChange={(e) => setAddress1(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridAddress2">
                                <Form.Label>Nearest Town</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter city"
                                    value={address2}
                                    onChange={(e) => setAddress2(e.target.value)}
                                />
                            </Form.Group>
                        </Row>
                        <Form.Group className="mb-3" id="formGridEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
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

export default CustomerRegistration;
