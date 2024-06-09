// Material.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Form, Button } from 'react-bootstrap';
import AdminBar from '../../component/AdminBar';
import ProfileBar from '../../component/ProfileBar';

function Material() {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState({
    R_Name: '',
    Buying_Price: ''
  });

  useEffect(() => {
    const fetchRawMaterials = async () => {
      try {
        const response = await axios.get('http://localhost:8081/rawmaterials');
        setRawMaterials(response.data);
      } catch (error) {
        console.error('Error fetching raw materials:', error);
      }
    };

    fetchRawMaterials();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMaterial({ ...newMaterial, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8081/rawmaterials', newMaterial);
      const updatedMaterials = await axios.get('http://localhost:8081/rawmaterials');
      setRawMaterials(updatedMaterials.data);
      setNewMaterial({ R_Name: '', Buying_Price: '' });
    } catch (error) {
      console.error('Error adding new material:', error);
    }
  };

  return (
    <div>
     <div><ProfileBar pageName="Raw Material"  /></div>
      <div style={{ display: 'flex' }}>
        <div><AdminBar /></div>
        <div style={{ marginLeft: '20px', flexGrow: 1 }}>
      <h1>Raw Material List</h1>
      <Table striped bordered>
        <thead>
          <tr>
            <th>R_ID</th>
            <th>R_Name</th>
            <th>Buying_Price</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {rawMaterials.map((rawMaterial) => (
            <tr key={rawMaterial.R_ID}>
              <td>{rawMaterial.R_ID}</td>
              <td>{rawMaterial.R_Name}</td>
              <td>{rawMaterial.Buying_Price}</td>
              <td>{rawMaterial.Stock}</td>
            </tr>
          ))}
          <tr>
            <td></td>
            <td>
              <Form.Control
                type="text"
                name="R_Name"
                value={newMaterial.R_Name}
                onChange={handleChange}
                placeholder="Enter R_Name"
              />
            </td>
            <td>
              <Form.Control
                type="number"
                name="Buying_Price"
                value={newMaterial.Buying_Price}
                onChange={handleChange}
                placeholder="Enter Buying_Price"
              />
            </td>
            <td></td>
            <td>
              <Button variant="primary" onClick={handleSubmit}>Add</Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
    </div></div>
  );
}

export default Material;
