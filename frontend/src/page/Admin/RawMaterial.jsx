import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container, Form, Button } from 'react-bootstrap';
import RMinv from '../../component/RMinv';
import AdminBar from '../../component/AdminBar';
import ProfilenavBar from '../../component/ProfilenavBar';

function RawMaterial() {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [newRawMaterial, setNewRawMaterial] = useState({
    R_Name: '',
    Quantity: '',
    Date: '',
    Action: ''
  });
  const [rawMaterialNames, setRawMaterialNames] = useState([]);
  const [showPopup, setShowPopup] = useState(false); 
  const handlePopupShow = () => {
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    const fetchRawMaterials = async () => {
      try {
        const response = await axios.get('http://localhost:8081/getRawMaterialInventory');
        setRawMaterials(response.data);
      } catch (error) {
        console.error('Error fetching raw material inventory:', error);
      }
    };

    const fetchRawMaterialNames = async () => {
      try {
        const response = await axios.get('http://localhost:8081/getRawMaterialNames');
        setRawMaterialNames(response.data);
      } catch (error) {
        console.error('Error fetching raw material names:', error);
      }
    };

    fetchRawMaterials();
    fetchRawMaterialNames();
  }, []);

  const getActionText = (action) => {
    return action === 1 ? 'Purchase' : 'Use';
  };

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
      await axios.post('http://localhost:8081/addRawMaterial', newRawMaterial);
      // Refresh raw materials list after adding
      const response = await axios.get('http://localhost:8081/getRawMaterialInventory');
      setRawMaterials(response.data);
      // Clear input fields
      setNewRawMaterial({
        R_Name: '',
        Quantity: '',
        Date: '',
        Action: ''
      });
    } catch (error) {
      console.error('Error adding raw material:', error);
    }
  };

  return (
    <div>
     <div><ProfilenavBar userType="admin" /></div>
      <div style={{ display: 'flex' }}>
        <div><AdminBar /></div>
        <div style={{ marginLeft: '20px', flexGrow: 1 }}></div>
    <Container className="mt-5">
      <h1>Raw Material Inventory</h1>

      <Button variant="primary" onClick={handlePopupShow}>Open Popup</Button>
      <RMinv show={showPopup} handleClose={handlePopupClose} /> {/* Render the Popup component */}

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Raw Material Name</th>
            <th>Quantity</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        {rawMaterials.map((item,index) => (
  <tr key={`${item.R_ID}_${item.Date}_${index}`}>
    <td>{item.R_Name}</td>
    <td>{item.Quantity}</td>
    <td>{new Date(item.Date).toLocaleDateString()}</td>
    <td>{getActionText(item.Action)}</td>
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
              <Form.Control as="select" name="Action" value={newRawMaterial.Action} onChange={handleInputChange}>
                <option value="">Select Action</option>
                <option value="1">Purchase</option>
                <option value="0">Use</option>
              </Form.Control>
            </td>
            <td>
              <Button variant="primary" onClick={handleSubmit}>Add</Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </Container>
    </div></div>
  );
}

export default RawMaterial;
