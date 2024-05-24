import React from 'react';

function ProductInv({ productionData = [] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Production Quantity</th>
          <th>Order Item Quantity</th>
          <th>Total Quantity</th>
        </tr>
      </thead>
      <tbody>
        {productionData.map((row) => (
          <tr key={row.productId}>
            <td>{row.productName}</td>
            <td>{row.productionQuantity}</td>
            <td>{row.orderItemQuantity}</td>
            <td>{row.totalQuantity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProductInv;
