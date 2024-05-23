import React from 'react';

function ProductInv({ productions = [], orderItems = [] }) {
  const calculateTotalQuantity = (productId) => {
    const production = productions.find((prod) => prod.Product_ID === productId);
    const orderItemsForProduct = orderItems.filter((item) => item.Product_ID === productId);
    const productionQuantity = production ? production.Quantity : 0;
    const orderItemQuantity = orderItemsForProduct.reduce((acc, curr) => acc + curr.Quantity, 0);
    return productionQuantity - orderItemQuantity; // We're subtracting here because order items represent products that have been sold
  };

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
        {productions.map((production, index) => (
          <tr key={`${production.Product_Name}-${production.Date}`}>
            <td>{production.Product_Name}</td>
            <td>{production.Quantity}</td>
            <td>{orderItems.filter((item) => item.Product_ID === production.Product_ID).reduce((acc, curr) => acc + curr.Quantity, 0)}</td>
            <td>{calculateTotalQuantity(production.Product_ID)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProductInv;
