import React from 'react';
import {Nav,Navbar,Container} from 'react-bootstrap';
    
    function ProfilenavBar()  {
      return (
        <div>
          <Navbar bg="light" data-bs-theme="light">
            <Container>
            <Navbar.Brand >Omega</Navbar.Brand>
              <Nav className="me-auto">
                <Nav.Link href="login">Profile</Nav.Link>
                <Nav.Link href="signup">Settings</Nav.Link>
               
              </Nav>
            </Container>
          </Navbar>
        </div>
      );
    }
    
export default ProfilenavBar;
