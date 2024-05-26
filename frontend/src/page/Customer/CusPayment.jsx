import React, { useState, useEffect } from 'react';
import ProfilenavBar from '../../component/ProfilenavBar';

import { Table, Form } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';

function CusPayment() {
  const [orders, setOrders] = useState([]);
  const [customerId, setCustomerId] = useState(null);


  const fetchCustomerId = async () => {
    try {
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        throw new Error('User not found in local storage');
      }
      const user = JSON.parse(userJson);
      const userId = user.User_ID;
      const response = await axios.get(`http://localhost:8081/customer/${userId}`);
      const customerId = response.data.customerId;
      setCustomerId(customerId);
    } catch (error) {
      console.error('Error fetching customerId:', error);
    }
  };


  useEffect(() => {
    fetchCustomerId();
  }, []);

  
  
  const fetchCustomerOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/customer_order/${customerId}`);
      console.log('Order data:', response.data);
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchCustomerOrders();
    }
  }, [customerId]);

  

  return (
    <div>
      <div>
        <ProfilenavBar userType="customer"/>
      </div>

      <div style={{ textAlign: 'center', padding: '20px', width: 'fit-content', margin: 'auto' }}>
        <h1>Payments</h1>
      </div>
      <div style={{ textAlign: 'center', padding: '20px', width: 'fit-content', margin: 'auto' }}>
        <Table striped bordered hover className="table" style={{ borderColor: 'black', borderWidth: '2px', borderStyle: 'solid' }}>
          <thead className="table-header">

            <tr >
              <th style={{ backgroundColor: '#1F618D', color: 'white', textAlign: 'center', fontSize: '18px',width: '100px'}}>Order Number</th>
              <th style={{ backgroundColor: '#1F618D', color: 'white', textAlign: 'center', fontSize: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>Product</div>
        <div>
          <div>Quantity</div>
          <div>(kg)</div>
        </div>
        <div>
          <div>Value</div>
          <div>(LKR)</div>
        </div>
      </div>
              </th>
              <th style={{ backgroundColor: '#1F618D', color: 'white', textAlign: 'center', fontSize: '18px' }}>Total Payment(Rs)</th>
              <th style={{ backgroundColor: '#1F618D', color: 'white', textAlign: 'center', fontSize: '18px' }}>Deliver Date</th>
              <th style={{ backgroundColor: '#1F618D', color: 'white', textAlign: 'center', fontSize: '18px' }}>Status</th>
            </tr>
          </thead>
          <tbody style={{textAlign: 'center',fontSize: '18px'}} >
            {orders.map((customer_order) => (
             <tr key={customer_order.Order_ID}>
                <td>{customer_order.Order_ID}</td>
                <td>
        {customer_order.Products.split(',').map((item, index) => {
          const [name, qty, value] = item.split(' - ');
          return (
            <div key={index}>
              <span style={{ display: 'inline-block', width: '150px',textAlign: 'left' }}>{name}</span>
              <span style={{ display: 'inline-block', width: '100px',textAlign: 'left' }}>{qty}</span>
              <span>{value}</span>
            </div>
          );
        })}
      </td>
                 <td>{customer_order.Payment}</td>
                <td>{moment(customer_order.Deliver_Date).format('MM/DD/YYYY')}</td>
                <td>{customer_order.Payment_Status === 0 ? 'Pending' : 'Paid'}</td>
              
               
              </tr>
            ))}
          </tbody>
   
  
        </Table>
      </div>
    </div>
  );
}

export default CusPayment;
