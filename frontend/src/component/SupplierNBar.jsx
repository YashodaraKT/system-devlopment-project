import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import BImage from '../assets/nn.jpg';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

function Hnbar() {
  const navigate = useNavigate(); // Initialize navigate from useNavigate

  const handleLogout = () => {
    // Clear user details from local storage
    localStorage.removeItem('user');
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div>
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <img src={BImage} alt="Your Image" style={{ height: '125px', width: '100%', objectFit: 'cover' }} />
      </div>
      <Navbar style={{ backgroundColor: '#CCCCCC' }} data-bs-theme="light">
        <Container>
          <Navbar.Brand style={{ fontSize: '1.5rem' }}>Omega</Navbar.Brand>
          <Nav className="me-auto">
            <NavDropdown
              title="Transport"
              id="transport-dropdown"
              style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#000', transition: 'transform 0.3s' }}
              onMouseEnter={(e) => (e.target.style.transform = 'translateY(-5px)')}
              onMouseLeave={(e) => (e.target.style.transform = 'translateY(0)')}
            >
              <NavDropdown.Item href="transport">Change Permanently</NavDropdown.Item>
              <NavDropdown.Item href="onedayt">One Day Change</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link
              href="spayment"
              style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#000', transition: 'transform 0.3s' }}
              onMouseEnter={(e) => (e.target.style.transform = 'translateY(-5px)')}
              onMouseLeave={(e) => (e.target.style.transform = 'translateY(0)')}
            >
              Payments
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href="/changepw" style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#000' }}>
              Change Password
            </Nav.Link>
            <Nav.Link onClick={handleLogout} style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#000' }}>
              Logout
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
}

export default Hnbar;
