import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import BImage from '../assets/nn.jpg';
import { FaSearch, FaShoppingCart, FaCalendarAlt, FaMoneyBill, FaCog, FaLock, FaSignOutAlt } from 'react-icons/fa';


function Hnbar() {
  return (
    <div>
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <img src={BImage} alt="Your Image" style={{ height: '125px', width: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: '0', right: '0', padding: '10px', display: 'flex', alignItems: 'center' }}>
          <FaSearch style={{ marginRight: '5px', color: 'white' }} />
          <input type="text" placeholder="Search..." style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </div>
      </div>
      <Navbar style={{ backgroundColor: '#CCCCCC' }} data-bs-theme="light">
        <Container>
          <Navbar.Brand style={{ fontSize: '1.5rem' }}>Omega</Navbar.Brand>
          <Nav className="me-auto" style={{ gap: '2px' }}>
            <Nav.Link
              href="/orders"
              style={{ fontSize: '1.2rem', color: '#000', transition: 'transform 0.3s', marginLeft: '20px' }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <FaShoppingCart style={{ marginRight: '5px' }} />
              Orders
            </Nav.Link>
            <Nav.Link
              href="/ocalendar"
              style={{ fontSize: '1.2rem', color: '#000', transition: 'transform 0.3s', marginLeft: '20px' }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <FaCalendarAlt style={{ marginRight: '5px' }} />
              Order calendar
            </Nav.Link>
            <Nav.Link
              href="/cpayment"
              style={{ fontSize: '1.2rem', color: '#000', transition: 'transform 0.3s', marginLeft: '20px' }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <FaMoneyBill style={{ marginRight: '5px' }} />
              Payments
            </Nav.Link>
          </Nav>
          <Nav>
            <NavDropdown title={<span><FaCog style={{ marginRight: '5px' }} />Settings</span>} id="basic-nav-dropdown" align="end">
              <NavDropdown.Item href="/changepw"><FaLock style={{ marginRight: '5px' }} />Change Password</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2"><FaSignOutAlt style={{ marginRight: '5px' }} />Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
}

export default Hnbar;
