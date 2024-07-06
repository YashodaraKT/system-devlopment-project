import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import AdminBar from '../../component/AdminBar';
import ProfileBar from '../../component/ProfileBar';

function NewOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8081/pending_orders");
      console.log("Order data:", response.data);
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleApprove = async (orderId) => {
    try {
      const response = await axios.put(`http://localhost:8081/Approval_orders/${orderId}`, {
        Approval: 1,
      });
      console.log("Order approved:", response.data);

      // Remove the approved order from the table
      setOrders((prevOrders) => prevOrders.filter((order) => order.Order_ID !== orderId));
    } catch (error) {
      console.error("Error approving order:", error.response ? error.response.data : error.message);
      alert(`Error approving order: ${error.response ? error.response.data.error : error.message}`);
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
      console.error("Error declining order:", error.response ? error.response.data : error.message);
      alert(`Error declining order: ${error.response ? error.response.data.error : error.message}`);
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

  const handleSelectProcess = async (orderId) => {
    try {
      const response = await axios.put(`http://localhost:8081/process_order/${orderId}`, {
        Process: 'YES',
      });
      console.log("Order processed:", response.data);
  
      // Update the order in the state to reflect the process status
      setOrders((prevOrders) => 
        prevOrders.map((order) => 
          order.Order_ID === orderId ? { ...order, Process: 'YES' } : order
        )
      );
  
    } catch (error) {
      console.error("Error processing order:", error.response ? error.response.data : error.message);
      alert(`Error processing order: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  const handleSubmit = async () => {
    try {
      for (const selectedOrder of selectedOrders) {
        const { orderId, isApproved } = selectedOrder; // Destructure orderId from selectedOrder
        if (isApproved) {
          await handleApprove(orderId);
        } else {
          await handleDecline(orderId);
        }
      }
  
      setSelectedOrders([]);
    } catch (error) {
      console.error("Error submitting orders:", error.response ? error.response.data : error.message);
      alert(`Error submitting orders: ${error.response ? error.response.data.error : error.message}`);
    }
  };
  

  useEffect(() => {
    // When the component mounts, retrieve the 'Process' status from local storage
    const processStatus = localStorage.getItem("processStatus");
    if (processStatus) {
      const parsedStatus = JSON.parse(processStatus);
      setSelectedOrders(parsedStatus);
    }
  }, []);

  useEffect(() => {
    // When the selectedOrders state changes, update local storage
    localStorage.setItem("processStatus", JSON.stringify(selectedOrders));
  }, [selectedOrders]);

  return (
    <div>
      <div><ProfileBar pageName="Pending Orders" /></div>
      <div style={{ display: 'flex' }}>
        <div><AdminBar /></div>
        <div style={{ marginLeft: '20px', flexGrow: 1 }}>
          <div style={{ marginLeft: "20px", padding: "20px", width: "fit-content" }}>
          
          </div>
          <div style={{ marginLeft: "20px", padding: "20px", width: "fit-content" }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order No</TableCell>
                    <TableCell>Customer ID</TableCell>
                    <TableCell>Customer Name</TableCell>
                    <TableCell>Contact Number</TableCell>
                    <TableCell>Product Details(product-kg-Rs)</TableCell>
                    <TableCell>Order Date</TableCell>
                    <TableCell>Deliver Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Process</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((customer_order) => (
                    <TableRow key={customer_order.Order_ID}>
                      <TableCell>{customer_order.Order_ID}</TableCell>
                      <TableCell>{customer_order.Customer_ID}</TableCell>
                      <TableCell>{customer_order.Name}</TableCell>
                      <TableCell>{customer_order.Contact_Number}</TableCell>
                      <TableCell>
                        {customer_order["Product Details"].split(",\n").map((item, idx) => (
                          <div key={idx}>{item}</div>
                        ))}
                      </TableCell>
                      <TableCell>{moment(customer_order.Order_Date).format("MM/DD/YYYY")}</TableCell>
                      <TableCell>{moment(customer_order.Deliver_Date).format("MM/DD/YYYY")}</TableCell>
                      <TableCell>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedOrders.some((order) => order.orderId === customer_order.Order_ID && order.isApproved)}
                              onChange={() => handleSelectOrder(customer_order.Order_ID, true)}
                            />
                          }
                          label="Accept"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedOrders.some((order) => order.orderId === customer_order.Order_ID && !order.isApproved)}
                              onChange={() => handleSelectOrder(customer_order.Order_ID, false)}
                            />
                          }
                          label="Decline"
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={customer_order.Process === 'YES'}
                          disabled={customer_order.Process === 'YES'}
                          onChange={() => handleSelectProcess(customer_order.Order_ID)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button onClick={handleSubmit}>Submit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewOrders;
