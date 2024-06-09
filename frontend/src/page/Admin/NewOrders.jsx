import React, { useState, useEffect } from "react";
import { Table, Button, Form } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import AdminBar from '../../component/AdminBar';
import ProfileBar from '../../component/ProfileBar';

function NewOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);

  const fetchPendingOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8081/pending_orders");
      console.log("Order data:", response.data);
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const handleApprove = async (orderId) => {
    try {
      const response = await axios.put(`http://localhost:8081/Approval_orders/${orderId}`, {
        Approval: 1,
      });
      console.log("Order approved:", response.data);

      // Remove the approved order from the table
      setOrders((prevOrders) => prevOrders.filter((order) => order.Order_ID !== orderId));
    } catch (error) {
      console.error("Error approving order:", error);
    }
  };

  const handleDecline = async (orderId) => {
    try {
      const response = await axios.put(`http://localhost:8081/Approval_orders/${orderId}`, {
        Approval: 0,
      });
      console.log("Order declined:", response.data);

      // Remove the declined order from the table
      setOrders((prevOrders) => prevOrders.filter((order) => order.Order_ID !== orderId));
    } catch (error) {
      console.error("Error declining order:", error);
    }
  };

  const handleSelectOrder = (orderId, isApproved) => {
    setSelectedOrders((prevSelectedOrders) => {
      const index = prevSelectedOrders.findIndex((order) => order.orderId === orderId);

      if (index === -1) {
        // Add new order to selected orders
        return [...prevSelectedOrders, { orderId, isApproved }];
      } else {
        // Update existing order in selected orders
        const updatedOrders = [...prevSelectedOrders];
        updatedOrders[index] = { orderId, isApproved };
        return updatedOrders;
      }
    });
  };

  const handleSubmit = async () => {
    try {
      for (const order of selectedOrders) {
        if (order.isApproved) {
          await handleApprove(order.orderId);
        } else {
          await handleDecline(order.orderId);
        }
      }

      // Clear selected orders
      setSelectedOrders([]);
    } catch (error) {
      console.error("Error submitting orders:", error);
    }
  };

  return (
    <div>
     <div><ProfileBar pageName="Pending Orders" /></div>
      <div style={{ display: 'flex' }}>
        <div><AdminBar /></div>
        <div style={{ marginLeft: '20px', flexGrow: 1 }}>
      <div style={{ marginLeft: "50px", padding: "20px", width: "fit-content" }}>
        <h1>Customer Orders</h1>
      </div>
      <div style={{ marginLeft: "50px", padding: "20px", width: "fit-content" }}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Order No</th>
              <th>Customer ID</th>
              <th>Customer Name</th>
              <th>Contact Number</th>
              <th>Product Details</th>
              <th>Order Date</th>
              <th>Deliver Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((customer_order) => (
              <tr key={customer_order.Order_ID}>
                <td>{customer_order.Order_ID}</td>
                <td>{customer_order.Customer_ID}</td>
                <td>{customer_order.Name}</td>
                <td>{customer_order.Contact_Number}</td>
                <td>
                  {customer_order["Product Details"].split(",\n").map((item, idx) => (
                    <div key={idx}>{item}</div>
                  ))}
                </td>
                <td>{moment(customer_order.Order_Date).format("MM/DD/YYYY")}</td>
                <td>{moment(customer_order.Deliver_Date).format("MM/DD/YYYY")}</td>
                <td>
                  <Form.Check
                    type="checkbox"
                    label="Accept"
                    checked={selectedOrders.some((order) => order.orderId === customer_order.Order_ID && order.isApproved)}
                    onChange={() => handleSelectOrder(customer_order.Order_ID, true)}
                  />
                  <Form.Check
                    type="checkbox"
                    label="Decline"
                    checked={selectedOrders.some((order) => order.orderId === customer_order.Order_ID && !order.isApproved)}
                    onChange={() => handleSelectOrder(customer_order.Order_ID, false)}
                  />
                </td>
                <td>
                  <Button onClick={handleSubmit}>Submit</Button>
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

export default NewOrders;
