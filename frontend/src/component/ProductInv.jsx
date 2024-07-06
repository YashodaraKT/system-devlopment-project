import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

function ProductInv({ productionData = [] }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Product Name</TableCell>
          <TableCell>Total Quantity(kg)</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {productionData.map((row) => (
          <TableRow key={row.productId}>
            <TableCell>{row.productName}</TableCell>
            <TableCell>
              {row.totalQuantity === 0 ? 'Out of Stock' : `${row.totalQuantity} kg`}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default ProductInv;
