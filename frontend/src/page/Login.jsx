import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css'; 
import axios from "axios";
import cw from '../assets/cw.jpg'; 
import Footer from '../component/Footer';

function Login() {
  const navigate = useNavigate();
  const [User_Name, setUser_Name] = useState('');
  const [Password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false); // State to manage the error modal
  const [validationErrors, setValidationErrors] = useState({ User_Name: '', Password: '' });

  function handleSubmit(event) {
    event.preventDefault();
    const errors = { User_Name: '', Password: '' };

    if (User_Name === '') {
      errors.User_Name = 'Username is required.';
    }

    if (Password === '') {
      errors.Password = 'Password is required.';
    }

    if (errors.User_Name || errors.Password) {
      setValidationErrors(errors);
      return;
    }

    axios.post('http://localhost:8081/login', { User_Name, Password })
      .then(res => {
        if (res.data.status === "success") {
          localStorage.setItem('user', JSON.stringify(res.data.user));
          if (res.data.user.User_Type === 'Supplier') {
            navigate('/SupplierHome');
          } else if (res.data.user.User_Type === 'Customer') {
            navigate('/CusHome');
          } else if (res.data.user.User_Type === 'Employee') {
            navigate('/emphome');
          } else if (res.data.user.User_Type === 'Admin') {
            navigate('/adminhome');
          }
        } else {
          setError('Invalid username or password. Please try again.');
          setShowErrorModal(true); // Show the error modal
        }
      })
      .catch(err => {
        console.error(err);
        setError('An error occurred while logging in. Please try again later.');
        setShowErrorModal(true); // Show the error modal
      });
  }

  const handleCloseModal = () => setShowErrorModal(false); // Function to close the error modal

  return (
    <div>
      <div className='logsignup-container'>
        <div className='logsignup-form'>
          <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <div className='logsignup-input'>
              <label htmlFor='User_Name'>User Name <span className="text-danger">*</span></label>
              <input type='text' placeholder='Enter User Name' className='form-control rounded-0'
                onChange={e => setUser_Name(e.target.value)} />
              {validationErrors.User_Name && <small className="text-danger">{validationErrors.User_Name}</small>}
            </div>

            <div className='logsignup-input'>
              <label htmlFor='Password'>Password <span className="text-danger">*</span></label>
              <input type='password' placeholder='Enter Password' className='form-control rounded-0'
                onChange={e => setPassword(e.target.value)} />
              {validationErrors.Password && <small className="text-danger">{validationErrors.Password}</small>}
            </div>

            <Button onClick={handleSubmit} type="submit" variant="outline-success" className='logsignup-button w-100'>Log in</Button>{' '}
          </form>
        </div>
        <div className='logsignup-image'>
          <img src={cw} alt='loginimage' />
        </div>
      </div>
      <Footer />

      {/* Error Modal */}
      <Modal show={showErrorModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Login;
