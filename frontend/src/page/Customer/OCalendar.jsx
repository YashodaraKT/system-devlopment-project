import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import CustomerBar from '../../component/CustomerBar';
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
                if (order.Approval === 0) {
                    color = 'red';
                } else if (order.Approval === 1) {
                    color = 'green';
                } else if (order.Approval === 10 && order.Process === 'YES') {
                    color = '#008ECC'; // blue
                } else if (order.Approval === 10 && order.Process === 'NO') {
                    color = 'gray';
                } else {
                    color = '#008ECC'; // Default color if Approval value is not 0, 1, or 10
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
            <div>
                <CustomerBar />
            </div>

            {/* Color-coded boxes for order status */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <div style={{ backgroundColor: 'green', width: '100px', height: '50px', marginRight: '10px' }}>Already Done</div>
                <div style={{ backgroundColor: 'red', width: '100px', height: '50px', marginRight: '10px' }}>Rejected</div>
                <div style={{ backgroundColor: 'gray', width: '100px', height: '50px', marginRight: '10px' }}>No Response</div>
                <div style={{ backgroundColor: '#008ECC', width: '100px', height: '50px', marginRight: '10px' }}>Processing</div>
            </div>

            <div style={{ textAlign: 'center', padding: '20px', width: 'fit-content', margin: 'auto' }}>
                <h2>Calendar</h2>
                <br />
                <div style={{ textAlign: 'center', padding: '20px', width: 'fit-content', margin: 'auto', border: '2px solid black', padding: '10px', borderRadius: '5px' }}>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500, width: '80vw', fontSize: '18px' }}
                        onSelectEvent={handleEventClick}
                        eventPropGetter={event => ({
                            style: {
                                backgroundColor: event.color,
                            },
                        })}
                        views={['month', 'agenda']}
                        dayPropGetter={(date) => {
                            return {
                                style: {
                                    border: '1px solid black', // Set border width and color
                                },
                            };
                        }}
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
