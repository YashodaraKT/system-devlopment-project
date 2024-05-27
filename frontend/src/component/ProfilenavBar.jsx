import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NImage from '../assets/nn.jpg';
import { FaSearch } from 'react-icons/fa'; // Import the search icon from react-icons library

function ProfilenavBar({ userType }) {
  const navbarStyle = {
    backgroundColor: '#CCCCCC',
    fontSize: '25px',
    color: 'white'
  };

  const navLinkStyle = {
    color: 'black',
    fontSize: '20px' // Adjust the font size as needed
  };

  let profileLink; // Declare profileLink variable here

  switch (userType) {
    case 'customer':
      profileLink = '/cushome';
      break;
    case 'supplier':
      profileLink = '/SupplierHome';
      break;
    case 'admin':
      profileLink = '/adminhome';
      break;
    case 'employee':
      profileLink = '/emphome';
      break;
    default:
      profileLink = '/'; 
      break;
  }

  return (
    <div>
      
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <img src={NImage} alt="Your Image" style={{ height: '125px', width: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: '0', right: '0', padding: '10px', display: 'flex', alignItems: 'center' }}>
          <FaSearch style={{ marginRight: '5px', color: 'white' }} /> {/* Render the search icon with white color */}
          <input type="text" placeholder="Search..." style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </div>
      </div>
      <Navbar style={navbarStyle} variant="dark">
        <Container>
          <Navbar.Brand style={navbarStyle}>Omega</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link style={navLinkStyle} href={profileLink}>Profile</Nav.Link>
            <Nav.Link style={navLinkStyle} href="/changepw">Change Password</Nav.Link> 
            <Nav.Link style={navLinkStyle} href="s">Settings</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
}

export default ProfilenavBar;
