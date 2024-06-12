import React, { useState, useEffect } from 'react';
import CustomerBar from '../../component/CustomerBar';
import axios from 'axios';
import moment from 'moment';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';

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
      <CustomerBar/>

      <Box sx={{ textAlign: 'center', padding: '20px', width: 'fit-content', margin: 'auto' }}>
        <Typography variant="h4">Payments</Typography>
      </Box>
      
      <Box sx={{ textAlign: 'center', padding: '20px', width: 'fit-content', margin: 'auto' }}>
        <TableContainer component={Paper} sx={{ borderColor: 'black', borderWidth: '2px', borderStyle: 'solid' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: '#1F618D', color: 'white', textAlign: 'center', fontSize: '18px', width: '100px' }}>Order Number</TableCell>
                <TableCell sx={{ backgroundColor: '#1F618D', color: 'white', textAlign: 'center', fontSize: '18px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>Product</Box>
                    <Box>
                      <Box>Quantity</Box>
                      <Box>(kg)</Box>
                    </Box>
                    <Box>
                      <Box>Value</Box>
                      <Box>(LKR)</Box>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ backgroundColor: '#1F618D', color: 'white', textAlign: 'center', fontSize: '18px' }}>Payment(Rs)</TableCell>
                <TableCell sx={{ backgroundColor: '#1F618D', color: 'white', textAlign: 'center', fontSize: '18px' }}>Deliver Date</TableCell>
                <TableCell sx={{ backgroundColor: '#1F618D', color: 'white', textAlign: 'center', fontSize: '18px' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ textAlign: 'center', fontSize: '18px' }}>
              {orders.map((customer_order) => (
                <TableRow key={customer_order.Order_ID}>
                  <TableCell>{customer_order.Order_ID}</TableCell>
                  <TableCell>
                    {customer_order.Products.split(',').map((item, index) => {
                      const [name, qty, value] = item.split(' - ');
                      return (
                        <Box key={index}>
                          <span style={{ display: 'inline-block', width: '150px', textAlign: 'left' }}>{name}</span>
                          <span style={{ display: 'inline-block', width: '100px', textAlign: 'left' }}>{qty}</span>
                          <span>{value}</span>
                        </Box>
                      );
                    })}
                  </TableCell>
                  <TableCell>{customer_order.Payment}</TableCell>
                  <TableCell>{moment(customer_order.Deliver_Date).format('MM/DD/YYYY')}</TableCell>
                  <TableCell>{customer_order.Payment_Status === 0 ? 'Pending' : 'Paid'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}

export default CusPayment;
