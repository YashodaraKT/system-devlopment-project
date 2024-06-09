import React, { useState, useEffect } from 'react';
import ProfilenavBar from '../../component/ProfilenavBar';
import axios from 'axios';
import moment from 'moment';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';

function Spayment() {
  
  const [supplies, setSupplies] = useState([]);
  const [supplierId, setSupplierId] = useState(null);
  const [monthlyPayments, setMonthlyPayments] = useState({});

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

  const fetchSupplierSupplies = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/supply/${supplierId}`);
      console.log('Supply data:', response.data);
      setSupplies(response.data.supplies);
    } catch (error) {
      console.error('Error fetching supplies:', error);
    }
  };

  useEffect(() => {
    fetchSupplierId();
  }, []);

  useEffect(() => {
    if (supplierId) {
      fetchSupplierSupplies();
    }
  }, [supplierId]);

  useEffect(() => {
    if (supplies.length > 0) {
      const payments = {};
      supplies.forEach((supply) => {
        const month = moment(supply.Date).format('YYYY-MM');
        if (!payments[month]) {
          payments[month] = 0;
        }
        payments[month] += supply.Payment;
      });
      setMonthlyPayments(payments);
    }
  }, [supplies]);

  return (
    <div>
      <div>
        <ProfilenavBar userType="supplier" />
      </div>

      <Box sx={{ marginLeft: '50px', padding: '20px', width: 'fit-content' }}>
        <Typography variant="h4">Payments</Typography>
      </Box>

      <Box sx={{ marginLeft: '50px', padding: '20px', width: 'fit-content' }}>
        <Typography variant="h5">Monthly Payments</Typography>
        {Object.keys(monthlyPayments).map((month) => (
          <Typography key={month}>
            <strong>{month}:</strong> Rs {monthlyPayments[month].toFixed(2)}
          </Typography>
        ))}
      </Box>

      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: '20px' 
        }}
      >
        <TableContainer component={Paper} sx={{ width: '80%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Supply Number</TableCell>
                <TableCell>Quantity(kg)</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Value(Rs)</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {supplies.map((supply) => {
                console.log('Supply:', supply);
                return (
                  <TableRow key={supply.Supply_ID}>
                    <TableCell>{supply.Supply_ID}</TableCell>
                    <TableCell>{supply.Quantity}</TableCell>
                    <TableCell>{moment(supply.Date).format('DD-MMM-YYYY')}</TableCell>
                    <TableCell>{supply.Payment}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: supply.Payment_Status === 1 ? 'green' : 'red',
                          color: 'white',
                          padding: '5px',
                          borderRadius: '50%',
                          fontWeight: 'bold',
                          width: '24px',
                          height: '24px',
                          marginRight: '10px'
                        }}
                      ></Box>
                      <span>{supply.Payment_Status === 1 ? 'Paid' : 'Unpaid'}</span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}

export default Spayment;
