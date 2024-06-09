import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Table, TableRow, TableCell, TableBody, Card, CardContent, Tabs, Tab } from '@mui/material';
import SupplierRegistration from '../../component/SupplierRegistration';
import AdminBar from '../../component/AdminBar';
import UpdateSupplier from '../../component/UpdateSupplier'; 
import ProfileBar from '../../component/ProfileBar';



function ViewSupplier() {
 



  const [modalShow, setModalShow] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [editModalShow, setEditModalShow] = useState(false); 
  const [selectedSupplier, setSelectedSupplier] = useState(null); 
  const [tabValue, setTabValue] = useState(0);

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
      <div><ProfileBar pageName="Supplier"/></div>
      <div style={{ display: 'flex' }}>
        <div><AdminBar /></div>
        <div style={{ flexGrow: 1 }}>
        {/*<Container className="mt-5">*/}
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="View Supplier" />
              <Tab label="Add" />      
              {/* Add other tab items here */}
            </Tabs>
            {tabValue === 0 && (
              <div>
                <Table>
                  <thead>
                    <TableRow>
                      <TableCell>Supplier ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Contact Number</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Transport</TableCell>
                      <TableCell>Registered By</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </thead>
                  <TableBody>
                    {suppliers.map((supplier) => (
                      <TableRow key={supplier.Supplier_ID}>
                        <TableCell>{supplier.Supplier_ID}</TableCell>
                        <TableCell>{supplier.Name}</TableCell>
                        <TableCell>{supplier.Contact_Number}</TableCell>
                        <TableCell>{`${supplier.Address1}, ${supplier.Address2}`}</TableCell>
                        <TableCell>{getLocationName(supplier.Location_Id)}</TableCell>
                        <TableCell>{getTransport(supplier.Transport)}</TableCell>
                        <TableCell>{supplier.RegisteredBy}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            onClick={() => handleEditClick(supplier)}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              
                {selectedSupplier && (
                  <UpdateSupplier
                    show={editModalShow}
                    onHide={() => setEditModalShow(false)}
                    supplier={selectedSupplier}
                    fetchSuppliers={fetchSuppliers}
                    locations={locations}
                  />
                )}
              </div>
            )}
            {tabValue===1 &&(
              <div>
                <SupplierRegistration/>
              </div>
            )}
         {/* </Container>*/}
        </div>
      </div>
 
 </div>
  );
}

export default ViewSupplier;
