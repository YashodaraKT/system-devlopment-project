// EmpViewSupplier.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container, Button } from 'react-bootstrap';
import AdSupplier from '../../component/AdSupplier'; // Adjust path as per your project structure
import ProfileBar from '../../component/ProfileBar';
import EmpBar from '../../component/EmpBar';
import UpdateSupplier from '../../component/UpdateSupplier';

const EmpViewSupplier = () => {
  const [modalShow, setModalShow] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [editModalShow, setEditModalShow] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    fetchSuppliers();
    fetchLocations();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const result = await axios.get('http://localhost:8081/viewsupplier');
      setSuppliers(result.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const fetchLocations = async () => {
    try {
      const result = await axios.get('http://localhost:8081/location');
      setLocations(result.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const getLocationName = (locationId) => {
    const location = locations.find((loc) => loc.Location_Id === locationId);
    return location ? location.Location_Name : '';
  };

  const getTransport = (transport) => {
    return transport === 1 ? 'Yes' : 'No';
  };

  const handleEditClick = (supplier) => {
    setSelectedSupplier(supplier);
    setEditModalShow(true);
  };

  const handleShowModal = () => {
    setModalShow(true);
  };

  const handleCloseModal = () => {
    setModalShow(false);
  };

  return (
    <div>
      <div><ProfileBar userType="employee" /></div>
      <div style={{ display: 'flex' }}>
        <div><EmpBar /></div>
        <div style={{ marginLeft: '20px', flexGrow: 1 }}>
          <Container className="mt-5">
            <h1>Registered Suppliers</h1>
            <Button variant="primary" onClick={handleShowModal}>
              Add Supplier
            </Button>
            <br />
            <br />
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Supplier ID</th>
                  <th>Name</th>
                  <th>Contact Number</th>
                  <th>Address</th>
                  <th>Location</th>
                  <th>Transport</th>
                  <th>Registered By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr key={supplier.Supplier_ID}>
                    <td>{supplier.Supplier_ID}</td>
                    <td>{supplier.Name}</td>
                    <td>{supplier.Contact_Number}</td>
                    <td>{`${supplier.Address1}, ${supplier.Address2}`}</td>
                    <td>{getLocationName(supplier.Location_Id)}</td>
                    <td>{getTransport(supplier.Transport)}</td>
                    <td>{supplier.RegisteredBy}</td>
                    <td>
                      <Button
                        variant="secondary"
                        onClick={() => handleEditClick(supplier)}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <AdSupplier
              show={modalShow}
              onHide={handleCloseModal}
              fetchSuppliers={fetchSuppliers}
            />
            {selectedSupplier && (
              <UpdateSupplier
                show={editModalShow}
                onHide={() => setEditModalShow(false)}
                supplier={selectedSupplier}
                fetchSuppliers={fetchSuppliers}
                locations={locations}
              />
            )}
          </Container>
        </div>
      </div>
    </div>
  );
};

export default EmpViewSupplier;
