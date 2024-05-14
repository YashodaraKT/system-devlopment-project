import React, { useState, useEffect } from 'react';
import ProfilenavBar from '../../component/ProfilenavBar';
import { Table, Form } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';

function Spayment() {
  const [supplies, setSupplies] = useState([]);
  const [supplierId, setSupplierId] = useState(null);


  const fetchSupplierId = async () => {
    try {
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        throw new Error('User not found in local storage');
      }
      console.log('User JSON:', userJson);
      const user = JSON.parse(userJson);
      console.log('Parsed User:', user);
      const userId = user.User_ID;
      const response = await axios.get(`http://localhost:8081/supplier/${userId}`);
      console.log('Supplier data:', response.data);
      const supplierId = response.data.supplierId; // Update this line
      console.log('Supplier ID:', supplierId);
      setSupplierId(supplierId);
    } catch (error) {
      console.error('Error fetching supplierId:', error);
    }
  };


  useEffect(() => {
    fetchSupplierId();
  }, []);


  
  
  const fetchSupplierSupplies = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/supply/${supplierId}`);
      console.log('Supply data:', response.data); // Add this line
      setSupplies(response.data.supplies);
    } catch (error) {
      console.error('Error fetching supplies:', error);
    }
  };

  useEffect(() => {
    if (supplierId) {
      fetchSupplierSupplies();
    }
  }, [supplierId]);

  

  return (
    <div>
      <div>
        <ProfilenavBar />
      </div>

      <div style={{ marginLeft: '50px', padding: '20px', width: 'fit-content' }}>
        <h1>Payments</h1>
      </div>
      <div style={{ marginLeft: '50px', padding: '20px', width: 'fit-content' }}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Supply Number</th>
              <th>Quantity(kg)</th>
              <th>Date</th>
              <th>Value(Rs)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
  {supplies.map((supply) => {
    console.log('Supply:', supply); // Add this line
    return (
      <tr key={supply.Supply_ID}>
        <td>{supply.Supply_ID}</td>
        <td>{supply.Quantity}</td>
        <td>{moment(supply.Date).format('MM/DD/YYYY')}</td>
        <td>{supply.Payment}</td>
        <td>
          
        <div style={{
    display: "flex",
    alignItems: "center",
    backgroundColor: supply.Payment_Status === 1 ? "green" : "red",
    color: "white",
    padding: "5px",
    borderRadius: "50%",
    fontWeight: "bold",
    width: "24px",
    height: "24px",
    marginRight: "10px"
  }}>
     
  </div>
  <span>{supply.Payment_Status === 1 ? "Paid" : "Unpaid"}</span>
</td>

      </tr>
    );
  })}
</tbody>
        </Table>
      </div>
    </div>
  );
}

export default Spayment;
