import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container, Button } from 'react-bootstrap';
import CustomerRegistration from '../../component/CustomerRegistration';
import UpdateCustomer from '../../component/UpdateCustomer'; 
import AdminBar from '../../component/AdminBar';
import ProfileBar from '../../component/ProfileBar';

function ViewCustomer() {
  const [modalShow, setModalShow] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [editModalShow, setEditModalShow] = useState(false); // State for edit modal
  const [selectedCustomer, setSelectedCustomer] = useState(null); // State for the selected customer

  const fetchCustomers = async () => {
    const result = await axios.get('http://localhost:8081/viewcustomer');
    setCustomers(result.data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setEditModalShow(true);
  };

  return (
    <div>
     <div><ProfileBar pageName="Customer" /></div>
      <div style={{ display: 'flex' }}>
        <div><AdminBar /></div>
        <div style={{ marginLeft: '20px', flexGrow: 1 }}>
          <Container className="mt-5">
        <Button variant="primary" onClick={() => setModalShow(true)}>
          Add Customers
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
              <th>Email</th>
              <th>Actions</th> {/* Add Actions column */}
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.Customer_ID}>
                <td>{customer.Customer_ID}</td>
                <td>{customer.Name}</td>
                <td>{customer.Contact_Number}</td>
                <td>{`${customer.Address1}, ${customer.Address2}`}</td>
                <td>{customer.Email}</td>
                <td>
                  <Button
                    variant="secondary"
                    onClick={() => handleEditClick(customer)}
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <CustomerRegistration
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
        {selectedCustomer && (
          <UpdateCustomer
            show={editModalShow}
            onHide={() => setEditModalShow(false)}
            customer={selectedCustomer}
            fetchCustomers={fetchCustomers}
          />
        )}
      </Container>
    </div>
    </div>
    </div>
  );
}

export default ViewCustomer;
