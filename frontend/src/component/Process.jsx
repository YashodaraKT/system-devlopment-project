import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'; // Import components from Material-UI

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8081/api/process_products')
      .then(response => {
        console.log('Data fetched successfully:', response.data);
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error); // Set error state to display error message
      });
  }, []);

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
        <strong> Processing</strong>
        </Typography>
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <Table sx={{ maxWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell style={{ maxWidth: 150 }}>Product Name</TableCell>
                
                <TableCell align="right" style={{ maxWidth: 100 }}>In Stock(kg)</TableCell>
                <TableCell align="right" style={{ maxWidth: 150 }}>Order Q-Processing(kg)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map(product => (
                <TableRow key={product.Product_ID}>
                  <TableCell component="th" scope="row" style={{ maxWidth: 150 }}>
                    <Typography noWrap>
                      {product.Product_Name}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" style={{ maxWidth: 100 }}>{product.In_Stock}</TableCell>
                  <TableCell align="right" style={{ maxWidth: 150 }}>{product.Total_Quantity_Ordered}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductTable;
