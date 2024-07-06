import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Form, Button } from 'react-bootstrap';
import AdminBar from '../../component/AdminBar';
import ProfileBar from '../../component/ProfileBar';

function Material() {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editMaterial, setEditMaterial] = useState({
    R_ID: '',
    Buying_Price: ''
  });

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
    if (editIndex !== null) {
      setEditMaterial({ ...editMaterial, [name]: value });
    } else {
      setNewMaterial({ ...newMaterial, [name]: value });
    }
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

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditMaterial({
      R_ID: rawMaterials[index].R_ID,
      Buying_Price: rawMaterials[index].Buying_Price
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8081/rawmaterials/${editMaterial.R_ID}`, { Buying_Price: editMaterial.Buying_Price });
      const updatedMaterials = await axios.get('http://localhost:8081/rawmaterials');
      setRawMaterials(updatedMaterials.data);
      setEditIndex(null);
      setEditMaterial({ R_ID: '', Buying_Price: '' });
    } catch (error) {
      console.error('Error updating material:', error);
    }
  };

  return (
    <div>
      <div><ProfileBar pageName="Raw Material" /></div>
      <div style={{ display: 'flex' }}>
        <div><AdminBar /></div>
        <div style={{ marginLeft: '20px', flexGrow: 1 }}>
          <h1>Raw Material List</h1>
          <Table striped bordered>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Buying Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rawMaterials.map((rawMaterial, index) => (
                <tr key={rawMaterial.R_ID}>
                  <td>{rawMaterial.R_ID}</td>
                  <td>{rawMaterial.R_Name}</td>
                  <td>
                    {editIndex === index ? (
                      <Form.Control
                        type="number"
                        name="Buying_Price"
                        value={editMaterial.Buying_Price}
                        onChange={handleChange}
                      />
                    ) : (
                      rawMaterial.Buying_Price
                    )}
                  </td>
                  <td>{rawMaterial.Stock}</td>
                  <td>
                    {editIndex === index ? (
                      <Button variant="success" onClick={handleUpdate}>Save</Button>
                    ) : (
                      <Button variant="primary" onClick={() => handleEdit(index)}>Edit</Button>
                    )}
                  </td>
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
      </div>
    </div>
  );
}

export default Material;
