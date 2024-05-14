import React, { useState, useEffect } from 'react';
import ProfilenavBar from '../../component/ProfilenavBar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import axios from 'axios';

function Orders({ customerId }) {
  const [orders, setOrders] = useState([]);

  const localizer = momentLocalizer(moment);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`/order/${customerId}`);
        if (response.data && response.data.order) {
          setOrders(response.data.order);
        }
      } catch (error) {
        console.error('There was an error fetching orders:', error);
      }
    };

    if (customerId) {
      fetchOrders();
    }
  }, [customerId]);

  const events = orders.map(order => ({
    title: order.Order_ID,
    start: moment(order.Order_Date, 'YYYY-MM-DD HH:mm:ss').toDate(),
    end: moment(order.Order_Date, 'YYYY-MM-DD HH:mm:ss').toDate(),
  }));

  return (
    <div>
      <ProfilenavBar />
      <div style={{ marginLeft: '50px', padding: '20px', width: 'fit-content' }}>
        <h1>Orders</h1>
      </div>

      <div style={{ height: 400 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          eventPropGetter={event => ({
            style: {
              backgroundColor: '#ffc107',
              borderRadius: '0px',
              opacity: 0.8,
              color: 'black',
              border: '0px',
              display: 'block',
            },
          })}
        />
      </div>
      <br />
      <br />

      <div style={{ marginLeft: '60px', border: '1px solid black', padding: '20px', width: 'fit-content' }}>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicType">
            <Form.Label>Product</Form.Label>
            <Form.Select aria-label="Default select example">
              <option>Select the Product</option>
              <option value="1">A</option>
              <option value="2">B</option>
              <option value="3">C</option>
              <option value="4">D</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicDate">
            <Form.Label>Date</Form.Label>
            <Form.Control type="date" placeholder="Select the Date" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicTime">
            <Form.Label>Quantity</Form.Label>
            <Form.Control type="number" placeholder="Add the Quantity" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPreOrderQuantity">
            <Form.Label>Pre-Order Quantity</Form.Label>
            <Form.Control type="number" placeholder="Add the Pre-Order Quantity" />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Orders;
