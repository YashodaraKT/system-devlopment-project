import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

function BasicExample() {
  const [showRegister, setShowRegister] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showChange, setShowChange] = useState(false);

  const toggleRegister = () => {
    setShowRegister(!showRegister);
  };

  const toggleOrders = () => {
    setShowOrders(!showOrders);
  };

  const toggleInventory = () => {
    setShowInventory(!showInventory);
  };

  const toggleChange = () => {
    setShowChange(!showChange);
  };

  const linkStyle = { margin: '20px 0', marginLeft: '30px', color: 'white', fontSize: '18px' };
  const dropdownItemStyle = { margin: '10px 0 10px 50px', color: 'white', fontSize: '18px' };

  return (
    <>
      <style type="text/css">
        {`
          .nav-dropdown-link {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .arrow {
            border: solid white;
            border-width: 0 2px 2px 0;
            display: inline-block;
            padding: 3px;
            margin-left: 10px;
          }

          .down {
            transform: rotate(45deg);
            -webkit-transform: rotate(45deg);
          }

          .up {
            transform: rotate(-135deg);
            -webkit-transform: rotate(-135deg);
          }
        `}
      </style>
      <Container fluid className="p-0 d-flex">
        <Navbar expand="lg" className="flex-column align-items-start" style={{ minHeight: '100vh', width: '200px', backgroundColor: '#1F618D' }}>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="flex-column justify-content-between w-100" style={{ height: '100vh' }}>
              <div>
                <Nav.Link href="/" style={linkStyle}>Home</Nav.Link>
                <Nav.Link href="/empviewsupplier" style={linkStyle}>Register Supplier</Nav.Link>
                <Nav.Link href="/empviewappoi" style={linkStyle}>Appointment</Nav.Link>
                <Nav.Link style={linkStyle} onClick={toggleInventory} className="nav-dropdown-link">
                  Inventory <span className={`arrow ${showInventory ? 'up' : 'down'}`}></span>
                </Nav.Link>
                {showInventory && (
                  <>
                    <Nav.Link href="/empproduction" style={dropdownItemStyle}>Production</Nav.Link>
                    <Nav.Link href="/emprawmaterial" style={dropdownItemStyle}>Raw Material</Nav.Link>
                  </>
                )}
                <Nav.Link href="/empsuppay" style={linkStyle}>Supplies</Nav.Link>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    </>
  );
}

export default BasicExample;
