import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import { jsPDF } from 'jspdf';
import AdminBar from '../../component/AdminBar';
import ProfileBar from '../../component/ProfileBar';
import headerImg from '../../assets/Bill.png';


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

      if (newPaymentStatus === 1) {
        generateBill(updatedOrders[index]);
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const generateBill = (order) => {
    const doc = new jsPDF();

    // Add header image
   
    doc.addImage(headerImg, 'PNG', 10, 10, 140, 60);

    // Adding title
    doc.setFontSize(18);
    doc.text('Invoice', 105, 70, null, null, 'center');

    // Adding customer details with border
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Customer Details', 10, 60);
    doc.setFont('helvetica', 'normal');

    doc.setDrawColor(0, 0, 0);
    doc.rect(10, 65, 190, 30); // Border for customer details

    doc.text(`Order No: ${order.Order_ID}`, 12,90);
    doc.text(`Customer ID: ${order.Customer_ID}`, 12, 100);
    doc.text(`Customer Name: ${order.Name}`, 12, 110);
    doc.text(`Contact Number: ${order.Contact_Number}`, 12, 120);

    doc.text(`Order Date: ${moment(order.Order_Date).format('MM/DD/YYYY')}`, 150, 72);
    doc.text(`Deliver Date: ${moment(order.Deliver_Date).format('MM/DD/YYYY')}`, 150, 80);

    // Adding product details with border
    let yPosition = 110;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Product Details', 10, yPosition);

    yPosition += 5;
    doc.setDrawColor(0, 0, 0);
    doc.rect(10, yPosition, 190, 8); // Header border for product details
    doc.text('Product', 12, yPosition + 6);
    doc.text('Quantity (kg)', 100, yPosition + 6);
    doc.text('Value (LKR)', 150, yPosition + 6);

    yPosition += 10;
    doc.setFont('helvetica', 'normal');
    order['Product Details'].split(',\n').forEach((item) => {
      const [name, qty, value] = item.split(' - ');
      doc.rect(10, yPosition, 190, 8); // Border for each product detail row
      doc.text(name, 12, yPosition + 6);
      doc.text(qty, 100, yPosition + 6);
      doc.text(value, 150, yPosition + 6);
      yPosition += 10;
    });

    // Adding total payment with border
    yPosition += 5;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.rect(10, yPosition, 190, 10); // Border for total payment
    doc.text(`Total Payment: ${order.Payment} LKR`, 12, yPosition + 7);

    // Add footer image
    

    // Save the PDF
    doc.save(`Bill_Order_${order.Order_ID}.pdf`);
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
