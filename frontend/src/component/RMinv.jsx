import React, { useState, useEffect } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import axios from 'axios'; // Import Axios for making HTTP requests

function RMinv({ show, handleClose }) {
  // State to hold the material data
  const [materials, setMaterials] = useState([]);

  // Function to fetch materials data from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8081/getMaterials');
        setMaterials(response.data); // Update state with the received data
      } catch (error) {
        console.error('Error fetching materials:', error);
      }
    };

    fetchData(); // Call the fetchData function when the component mounts
  }, []);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Popup Title</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Material</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material, index) => (
              <tr key={index}>
                <td>{material.R_Name}</td>
                <td>{material.Stock}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RMinv;
