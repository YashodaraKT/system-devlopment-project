import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container, Form, Button } from 'react-bootstrap';
import RMinv from '../../component/RMinv';
import EmpBar from '../../component/EmpBar';
import ProfileBar from '../../component/ProfileBar';

function RawMaterial() {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [newRawMaterial, setNewRawMaterial] = useState({
    R_Name: '',
    Quantity: '',
    Date: '',
    Lot_Price: '',  // New field for price
  });
  const [rawMaterialNames, setRawMaterialNames] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchRawMaterials = async () => {
      try {
        const response = await axios.get('http://localhost:8081/getRawMaterialInventory');
        console.log('Fetched raw materials:', response.data); // Log the fetched data
        setRawMaterials(response.data); // Set initial raw materials
      } catch (error) {
        console.error('Error fetching raw material inventory:', error);
      }
    };

    const fetchRawMaterialNames = async () => {
      try {
        const response = await axios.get('http://localhost:8081/getRawMaterialNames');
        setRawMaterialNames(response.data); // Set raw material names
      } catch (error) {
        console.error('Error fetching raw material names:', error);
      }
    };

    fetchRawMaterials();
    fetchRawMaterialNames();

    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.User_ID) {
      setUserId(user.User_ID);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRawMaterial(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/addRawMaterial', {
        ...newRawMaterial,
        A_User_ID: userId // Include the User_ID when submitting the form
      });
      
      // Create a new raw material object to add to the list
      const addedRawMaterial = {
        R_ID: response.data.R_ID,
        ...newRawMaterial
      };
      
      // Update the rawMaterials state with the new item at the top
      setRawMaterials(prevMaterials => [addedRawMaterial, ...prevMaterials]);

      // Reset the form fields
      setNewRawMaterial({
        R_Name: '',
        Quantity: '',
        Date: '',
        Lot_Price: '', // Resetting the price
      });
    } catch (error) {
      console.error('Error adding raw material:', error);
    }
  };

  return (
    <div>
      <div><ProfileBar userType="employee" /></div>
      <div style={{ display: 'flex' }}>
        <div><EmpBar /></div>
        <div style={{ marginLeft: '20px', flexGrow: 1 }}>
          <Container className="mt-5">
            <h1>Raw Material Inventory</h1>
            <Button variant="primary" onClick={() => setShowPopup(true)}>Open Popup</Button>
            <RMinv show={showPopup} handleClose={() => setShowPopup(false)} />

            <Table striped bordered hover className="mt-3">
              <thead>
                <tr>
                  <th>Raw Material Name</th>
                  <th>Quantity</th>
                  <th>Date</th>
                  <th>Lot Price</th> {/* New column for Lot Price */}
                  <th>Entered By</th> {/* New column for who entered the data */}
                </tr>
              </thead>
              <tbody>
                {rawMaterials.map((item) => (
                  <tr key={item.R_ID}>
                    <td>{item.R_Name}</td>
                    <td>{item.Quantity}</td>
                    <td>{new Date(item.Date).toLocaleDateString()}</td>
                    <td>{item.Lot_Price}</td> {/* Display Lot Price */}
                    <td>{item.EnteredBy}</td> {/* Display who entered the data */}
                  </tr>
                ))}
                <tr>
                  <td>
                    <Form.Control as="select" name="R_Name" value={newRawMaterial.R_Name} onChange={handleInputChange}>
                      <option value="">Select Raw Material</option>
                      {rawMaterialNames.map((name) => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </Form.Control>
                  </td>
                  <td>
                    <Form.Control type="text" name="Quantity" value={newRawMaterial.Quantity} onChange={handleInputChange} />
                  </td>
                  <td>
                    <Form.Control type="date" name="Date" value={newRawMaterial.Date} onChange={handleInputChange} />
                  </td>
                  <td>
                    <Form.Control type="text" name="Lot_Price" value={newRawMaterial.Lot_Price} onChange={handleInputChange} placeholder="Price" />
                  </td>
                  <td>
                    <Button variant="primary" onClick={handleSubmit}>Add</Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Container>
        </div>
      </div>
    </div>
  );
}

export default RawMaterial;
