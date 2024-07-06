import React, { useState, useEffect } from 'react';
import CustomerBar from '../../component/CustomerBar';
import axios from 'axios';
import moment from 'moment';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Select,
  MenuItem,
} from '@mui/material';

function CusPayment() {
  const [orders, setOrders] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [paidCount, setPaidCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalPendingAmount, setTotalPendingAmount] = useState(0);
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

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

  useEffect(() => {
    calculateOrderStats();
  }, [orders, selectedMonth, selectedYear]);

  const calculateOrderStats = () => {
    let paid = 0;
    let pending = 0;
    let total = 0;
    let totalPending = 0;
    let totalPaid = 0;

    orders.forEach((order) => {
      if (
        selectedMonth &&
        moment(order.Deliver_Date).format('MM') !== selectedMonth
      ) {
        return;
      }
      if (
        selectedYear &&
        moment(order.Deliver_Date).format('YYYY') !== selectedYear
      ) {
        return;
      }

      if (order.Payment_Status === 0) {
        pending++;
        totalPending += order.Payment;
      } else {
        paid++;
        totalPaid += order.Payment;
      }
      total += order.Payment;
    });

    setPaidCount(paid);
    setPendingCount(pending);
    setTotalPayment(total);
    setTotalPendingAmount(totalPending);
    setTotalPaidAmount(totalPaid);
  };

  const years = Array.from(
    new Set(orders.map((order) => moment(order.Deliver_Date).format('YYYY')))
  );

  return (
    <div>
      <CustomerBar />

      <Box sx={{ textAlign: 'center', padding: '20px', width: 'fit-content', margin: 'auto' }}>
        <Typography variant="h4">Payments</Typography>
      </Box>

      <Box sx={{ textAlign: 'center', padding: '20px', width: 'fit-content', margin: 'auto' }}>
        <Card sx={{ width: '100%', maxWidth: '600px', backgroundColor: '#DDD', paddingLeft: '2rem' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <Select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                displayEmpty
                sx={{ marginRight: '10px' }}
              >
                <MenuItem value="">All Months</MenuItem>
                {[...Array(12).keys()].map((month) => (
                  <MenuItem key={month + 1} value={(month + 1).toString().padStart(2, '0')}>
                    {moment(`${month + 1}`, 'MM').format('MMMM')}
                  </MenuItem>
                ))}
              </Select>
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                displayEmpty
              >
                <MenuItem value="">All Years</MenuItem>
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
              <Box sx={{ color: 'green' }}>
                Total Paid{' '}
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {totalPaidAmount.toFixed(2)}
                </span>
              </Box>
              <Box sx={{ color: 'red' }}>
                Total Pending{' '}
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {totalPendingAmount.toFixed(2)}
                </span>
              </Box>
              <Box>
                Total Payment{' '}
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {totalPayment.toFixed(2)}
                </span>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

     <Box sx={{ padding: '20px', width: 'fit-content', margin: 'auto', display: 'flex', justifyContent: 'center'}}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Order Number</TableCell>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
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
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Payment(Rs)</TableCell>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Deliver Date</TableCell>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ textAlign: 'center', fontSize: '18px' }}>
              {orders
                .filter((order) => {
                  const orderDate = moment(order.Deliver_Date);
                  return (
                    (!selectedMonth || orderDate.format('MM') === selectedMonth) &&
                    (!selectedYear || orderDate.format('YYYY') === selectedYear)
                  );
                })
                .map((customer_order) => (
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
