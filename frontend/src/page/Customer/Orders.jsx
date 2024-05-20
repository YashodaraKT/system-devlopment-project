import React, { useState, useEffect } from 'react';
import ProfilenavBar from '../../component/ProfilenavBar';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

function CusPayment() {
  const [orders, setOrders] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [formFields, setFormFields] = useState([{ product: '', quantity: '' }]);
  const [ordervalue, setOrderValue] = useState(0);
  const [deliverDate, setDeliverDate] = useState('');
  const localizer = momentLocalizer(moment);

  //-------------------------------------------------------------------------------

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
//------------------------------------------------------------------------------
  useEffect(() => {
    fetchCustomerId();
  }, []);

  const fetchCustomerOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/customer_order/${customerId}`);
      console.log('Order data:', response.data);
      setOrders(response.data.orders);
      const eventsData = response.data.orders.map(order => {
        const products = order.Products.split(',').map(item => {
          const [name, qty, value] = item.split(' - ');
          return `${name} (${qty}, Rs ${value})`;
        }).join(', ');

        return {
          title: `Order ${order.Order_ID}`,
          details: `Products: ${products} | Total: Rs ${order.Payment}`,
          start: new Date(order.Deliver_Date),
          end: new Date(order.Deliver_Date),
          allDay: true,
          order,
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
//****************************************************************************** */

  const handleEventClick = event => {
    setSelectedOrder(event.order);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);
//----------------------------------------------------------------------------------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8081/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

//----------------------------------------------------------------------------

  const addFormField = () => {
    setFormFields([...formFields, { product: '', quantity: '' }]);
  };

  const handleFormChange = (index, event) => {
    const updatedFields = formFields.map((field, i) => 
      i === index ? { ...field, [event.target.name]: event.target.value } : field
    );
    setFormFields(updatedFields);
    calculateOrderValue(updatedFields);
  };

  //****************************************************************************************** */


  const calculateOrderValue = (fields) => {
    let total = 0;
    fields.forEach(field => {
      const product = products.find(p => p.Product_Name === field.product);
      if (product && field.quantity) {
        total += product.Selling_Price * field.quantity;
      }
    });
    setOrderValue(total);
  };
//------------------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderDate = moment().format('YYYY-MM-DD');
    try {
      const orderItems = formFields.map(field => {
        const product = products.find(p => p.Product_Name === field.product);
        return {
          Product_ID: product.Product_ID,
          Quantity: field.quantity,
          Value: field.quantity * product.Selling_Price,
        };
      });

      const orderData = {
        Customer_ID: customerId,
        Order_Date: orderDate,
        Deliver_Date: deliverDate,
        orderItems: orderItems,
      };

      console.log('Order data:', orderData);
      await axios.post('http://localhost:8081/customer_order', orderData);
      alert('Order placed successfully!');
      setFormFields([{ product: '', quantity: '' }]);
      setDeliverDate('');
      setOrderValue(0);
      fetchCustomerOrders();
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };
//**************************************************************************************** */
  return (
    <div>
      <div>
        <ProfilenavBar />
      </div>

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
              <p><strong>Total Payment:</strong> Rs {selectedOrder.Payment}</p>
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

      <div style={{ marginLeft: '60px', border: '1px solid black', padding: '20px', width: 'fit-content' }}>
        <Form onSubmit={handleSubmit}>
          {formFields.map((field, index) => (
            <div key={index} className="d-flex flex-row align-items-center mb-3">
              <Form.Group className="flex-fill" controlId={`formBasicType${index}`}>
                <Form.Label>Product</Form.Label>
                <Form.Select 
                  name="product"
                  value={field.product}
                  onChange={(e) => handleFormChange(index, e)}
                >
                  <option>Select the Product</option>
                  {products.map((product) => (
                    <option key={product.Product_Name} value={product.Product_Name}>
                      {product.Product_Name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="flex-fill ms-3" controlId={`formBasicTime${index}`}>
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  placeholder="Add the Quantity"
                  value={field.quantity}
                  onChange={(e) => handleFormChange(index, e)}
                />
              </Form.Group>

              {index === formFields.length - 1 && (
                <Button variant="info" onClick={addFormField} className="ms-2">
                  +
                </Button>
              )}
            </div>
          ))}

          <Form.Group className="mb-3" controlId="formBasicDate">
            <Form.Label>Date</Form.Label>
            <Form.Control 
              type="date"
              placeholder="Select the Date" 
              value={deliverDate}
              onChange={(e) => setDeliverDate(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>

        <div style={{ marginTop: '20px' }}>
          <h3>Order Value: Rs {ordervalue.toFixed(2)}</h3>
        </div>
      </div>
    </div>
  );
}

export default CusPayment;
