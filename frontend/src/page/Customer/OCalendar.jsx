import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';



function OCalendar() {
    const [orders, setOrders] = useState([]);
    const [customerId, setCustomerId] = useState(null);
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const localizer = momentLocalizer(moment);
  

    const fetchCustomerId = async () => {
        try {
          const userJson = localStorage.getItem('user');
          if (!userJson) {
            throw new Error('User not found in local storage');
          }
          const user = JSON.parse(userJson);
          const userId = user.User_ID;
          const response = await axios.get(`http://localhost:8081/customer/${userId}`);
          const customerId = response.data.customerId;
          setCustomerId(customerId);
        } catch (error) {
          console.error('Error fetching customerId:', error);
        }
      };

      useEffect(() => {
        fetchCustomerId();
      }, []);
    
      const fetchCustomerOrders = async () => {
        try {
          const response = await axios.get(`http://localhost:8081/calendar_order/${customerId}`);
          console.log('Order data:', response.data);
          setOrders(response.data.orders);
          const eventsData = response.data.orders.map(order => {
             
            const products = order.Products.split(',').map(item => {
              const [name, qty, value] = item.split(' - ');
              return `${name} (${qty}, Rs ${value})`;
            }).join(', ');

            let color;
  switch (order.Approval) {
    case 0:
      color = 'red'; // Change color to red for Approval value 0
      break;
    case 1:
      color = 'green'; // Change color to green for Approval value 1
      break;
    case 10:
      color = 'blue'; // Change color to blue for Approval value 10
      break;
    default:
      color = 'blue'; // Default color if Approval value is not 0, 1, or 10
  }
    
            return {
              title: `Order ${order.Order_ID}`,
              details: `Products: ${products} | Total: Rs ${order.Total_Payment}`,
              start: new Date(order.Deliver_Date),
              end: new Date(order.Deliver_Date),
              allDay: true,
              order,
              color,
            };
          });
          setEvents(eventsData);
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      };
    
      useEffect(() => {
        if (customerId) {
          fetchCustomerOrders();
        }
      }, [customerId]);


      
  const handleEventClick = event => {
    setSelectedOrder(event.order);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);






  return (
    <div>

<div style={{ marginLeft: '50px', padding: '20px', width: 'fit-content' }}>
        <h1>Orders</h1>
      </div>
      <div style={{ marginLeft: '50px', padding: '20px', width: 'fit-content' }}>
        <h2>Delivery Calendar</h2>

        <div style={{ border: '1px solid gray', padding: '10px', borderRadius: '5px' }}>
        <Calendar
  localizer={localizer}
  events={events}
  startAccessor="start"
  endAccessor="end"
  style={{ height: 500, width: '80vw' }}
  onSelectEvent={handleEventClick}
  eventPropGetter={event => ({
    style: {
      backgroundColor: event.color,
    },
  })}
  views={['month']} // Set to display only the month view
/>
        </div>


      </div>

      {selectedOrder && (
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Order Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ border: '1px solid gray', padding: '10px', borderRadius: '5px' }}>
              <p><strong>Order ID:</strong> {selectedOrder.Order_ID}</p>
              <p><strong>Products:</strong></p>
              <ul>
                {selectedOrder.Products.split(',').map((item, index) => {
                  const [name, qty, value] = item.split(' - ');
                  return (
                    <li key={index}>
                      {name} - {qty} (kg), Rs {value}
                    </li>
                  );
                })}
              </ul>
              <p><strong>Total Payment:</strong> Rs {selectedOrder.Total_Payment}</p>
              <p><strong>Deliver Date:</strong> {moment(selectedOrder.Deliver_Date).format('MM/DD/YYYY')}</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      
    </div>
  );
}
export default OCalendar;