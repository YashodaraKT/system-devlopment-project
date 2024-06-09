import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import AdminBar from '../../component/AdminBar';
import ProfileBar from '../../component/ProfileBar';

function ViewOrders() {
  const [orders, setOrders] = useState([]);

  const fetchCustomerOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8081/customer_orders');
      console.log('Order data:', response.data);
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchCustomerOrders();
  }, []);

  const handlePaymentStatusChange = async (orderId, currentStatus, index) => {
    const newPaymentStatus = currentStatus === 0 ? 1 : 0;
    const updatedOrders = [...orders];
    updatedOrders[index].Payment_Status = newPaymentStatus;
    setOrders(updatedOrders);
    try {
      const response = await axios.put(`http://localhost:8081/approved_payments/${orderId}`, {
        Payment_Status: newPaymentStatus,
      });
      console.log('Payment status updated:', response.data);
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  return (
    <div>
     <div><ProfileBar pageName="Approved Orders" /></div>
      <div style={{ display: 'flex' }}>
        <div><AdminBar /></div>
        <div style={{ marginLeft: '20px', flexGrow: 1 }}>
      <div style={{ marginLeft: '50px', padding: '20px', width: 'fit-content' }}>
        <h1>Customer Orders</h1>
      </div>
      <div style={{ marginLeft: '50px', padding: '20px', width: 'fit-content' }}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Order No</th>
              <th>Customer ID</th>
              <th>Customer Name</th>
              <th>Contact Number</th>
              <th>
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
              <th>Order Date</th>
              <th>Deliver Date</th>
              <th>Payment</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((customer_order, index) => (
              <tr key={customer_order.Order_ID}>
                <td>{customer_order.Order_ID}</td>
                <td>{customer_order.Customer_ID}</td>
                <td>{customer_order.Name}</td>
                <td>{customer_order.Contact_Number}</td>
                <td>
                  {customer_order['Product Details'].split(',\n').map((item, idx) => {
                    const [name, qty, value] = item.split(' - ');
                    return (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ display: 'inline-block', width: '200px' }}>{name}</span>
                        <span style={{ display: 'inline-block', width: '100px' }}>{qty}</span>
                        <span>{value}</span>
                      </div>
                    );
                  })}
                </td>
                <td>{moment(customer_order.Order_Date).format('MM/DD/YYYY')}</td>
                <td>{moment(customer_order.Deliver_Date).format('MM/DD/YYYY')}</td>
                <td>{customer_order.Payment}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={customer_order.Payment_Status === 1}
                    onChange={() => handlePaymentStatusChange(customer_order.Order_ID, customer_order.Payment_Status, index)}
                    style={{
                      accentColor: customer_order.Payment_Status === 1 ? 'green' : 'unset',
                    }}
                    disabled={customer_order.Payment_Status === 1}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
    </div>
    </div>
  );
}

export default ViewOrders;
