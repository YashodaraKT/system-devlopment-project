import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container, Button } from 'react-bootstrap';
import SupplierRegistration from '../../component/SupplierRegistration';
import AdminBar from '../../component/AdminBar';
import UpdateSupplier from '../../component/UpdateSupplier'; 
import ProfilenavBar from '../../component/ProfilenavBar';

function ViewSupplier() {
  const [modalShow, setModalShow] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [editModalShow, setEditModalShow] = useState(false); // State for edit modal
  const [selectedSupplier, setSelectedSupplier] = useState(null); // State for the selected supplier

  const fetchSuppliers = async () => {
    const result = await axios.get('http://localhost:8081/viewsupplier');
    setSuppliers(result.data);

    const locationResult = await axios.get('http://localhost:8081/location');
    setLocations(locationResult.data);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

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

  return (
    <div>
     <div><ProfilenavBar userType="admin" /></div>
      <div style={{ display: 'flex' }}>
        <div><AdminBar /></div>
        <div style={{ marginLeft: '20px', flexGrow: 1 }}>
          <Container className="mt-5">
        <h1>Registered Suppliers</h1>
        <Button variant="primary" onClick={() => setModalShow(true)}>
          Add Supplier
        </Button>
        <br />
        <br />
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Contact Number</th>
              <th>Address</th>
              <th>Location</th>
              <th>Transport</th>
              <th>Actions</th> {/* Add Actions column */}
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
        <SupplierRegistration
          show={modalShow}
          onHide={() => setModalShow(false)}
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
}

export default ViewSupplier;
