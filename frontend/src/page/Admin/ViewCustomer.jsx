import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container,Button } from 'react-bootstrap';
import CustomerRegistration from '../../component/CustomerRegistration';
import AdminBar from '../../component/AdminBar';

function ViewCustomer() {
 
  const [modalShow, setModalShow] = useState(false);
  const [customers, setCustomers] = useState([]);
  

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('http://localhost:8081/viewcustomer');
      setCustomers(result.data);
    };

    fetchData();
  }, []);


  return (

    <div>
    <div><AdminBar/></div>
    <Container className="mt-5"> 
      <h1>Registered Customers</h1>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        Add Customers
      </Button>
      <br></br>
      <br></br>
      <Table striped bordered hover>
        <thead>
          <tr>
          <th>ID</th>
            <th>Name</th>
            <th>Contact Number</th>
            <th>Address</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.Supplier_ID}>
                <td>{customer.Customer_ID}</td>
              <td>{customer.Name}</td>
              <td>{customer.Contact_Number}</td>
              <td>{`${customer.Address1}, ${customer.Address2}`}</td>
              <td>{customer.Email}</td>
             
            </tr>
          ))}
        </tbody>
        </Table>
      <CustomerRegistration
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </Container>
    </div>
  );
}

export default ViewCustomer;
