import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

const columns = [
  { field: 'Product_ID', headerName: 'Product ID', width: 150 },
  { field: 'Product_Name', headerName: 'Product Name', width: 200 },
  { field: 'In_Stock', headerName: 'In Stock', width: 150 },
  { field: 'Total_Quantity_Ordered', headerName: 'Total Quantity Ordered', width: 200 },
];

const ProductTable = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/api/process_products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the products!', error);
      });
  }, []);

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={products}
        columns={columns}
        pageSize={5}
        getRowId={(row) => row.Product_ID}
      />
    </Box>
  );
};

export default ProductTable;
