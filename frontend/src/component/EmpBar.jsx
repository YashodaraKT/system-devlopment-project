import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';



function EmpBar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">Omega</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/changepw">Change Password</Nav.Link>
            <NavDropdown title="Register" id="basic-nav-dropdown">
              <NavDropdown.Item href="/viewsupplier">Suppplier</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/viewappointment">Appointment</Nav.Link>

            <NavDropdown title="Inventory" id="basic-nav-dropdown">
            <NavDropdown.Item href="/production">Product</NavDropdown.Item>
            <NavDropdown.Item href="/rawmaterial">Raw Material</NavDropdown.Item>
            </NavDropdown> 
            <Nav.Link href="/suppayment">Supplies</Nav.Link>
           
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default EmpBar;