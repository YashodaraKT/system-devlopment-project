import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { House, PersonPlus, BoxArrowInDown, Cart, ArrowDown, ArrowUp, Box, Archive } from 'react-bootstrap-icons';

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
                <Nav.Link href="/adminhome" style={linkStyle}><House /> Home</Nav.Link>
                <Nav.Link style={linkStyle} onClick={toggleRegister} className="nav-dropdown-link">
                  <PersonPlus /> Users <span className={`arrow ${showRegister ? 'up' : 'down'}`}></span>
                </Nav.Link>
                {showRegister && (
                  <>
                    <Nav.Link href="/viewsupplier" style={dropdownItemStyle}>Supplier</Nav.Link>
                    <Nav.Link href="/viewcustomer" style={dropdownItemStyle}>Customer</Nav.Link>
                    <Nav.Link href="/viewstaff" style={dropdownItemStyle}>Staff</Nav.Link>
                  </>
                )}
                
                <Nav.Link style={linkStyle} onClick={toggleOrders} className="nav-dropdown-link">
                  <Cart /> Orders <span className={`arrow ${showOrders ? 'up' : 'down'}`}></span>
                </Nav.Link>
                {showOrders && (
                  <>
                    <Nav.Link href="/neworders" style={dropdownItemStyle}>Pending Orders</Nav.Link>
                    <Nav.Link href="/vieworders" style={dropdownItemStyle}>Approved Orders</Nav.Link>
                  </>
                )}
                <Nav.Link style={linkStyle} onClick={toggleInventory} className="nav-dropdown-link">
                  <BoxArrowInDown /> Inventory <span className={`arrow ${showInventory ? 'up' : 'down'}`}></span>
                </Nav.Link>
                {showInventory && (
                  <>
                    <Nav.Link href="/production" style={dropdownItemStyle}>Production</Nav.Link>
                    <Nav.Link href="/rawmaterial" style={dropdownItemStyle}>Raw Material</Nav.Link>
                  </>
                )}
                <Nav.Link href="/suppayment" style={linkStyle}><BoxArrowInDown /> Fish Collection</Nav.Link>
                <Nav.Link href="/product" style={linkStyle}><Box /> Product</Nav.Link>
                <Nav.Link href="/material" style={linkStyle}><Archive /> Raw Material</Nav.Link>
                <Nav.Link href="/pricerange" style={linkStyle}><Archive /> Price Range</Nav.Link>
            
              </div>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    </>
  );
}

export default BasicExample;
