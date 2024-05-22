import React, { useState, useEffect } from 'react';
import ProfilenavBar from '../../component/ProfilenavBar';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import CustomerCalendar from '../../component/CustomerCalendar';

function CusPayment() {
  const [products, setProducts] = useState([]);
  const [formFields, setFormFields] = useState([{ product: '', quantity: '' }]);
  const [ordervalue, setOrderValue] = useState(0);
  const [deliverDate, setDeliverDate] = useState('');
  const [customerId, setCustomerId] = useState(null); // Add this line
  const [showCalendar, setShowCalendar] = useState(false);

  const handleShowCalendar = () => setShowCalendar(true);
  const handleCloseCalendar = () => setShowCalendar(false);

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

  const fetchCustomerOrders = async () => {
    // Implement fetchCustomerOrders function
  };

  useEffect(() => {
    fetchCustomerId(); // Call fetchCustomerId on component mount

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderDate = moment().format('YYYY-MM-DD');
    try {
      const orderItems = formFields.map(field => {
        const product = products.find(p => p.Product_Name === field.product);
        return {
          Product_Name: product.Product_Name,
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

  return (
    <div>
      <div>
        <Button variant="primary" onClick={handleShowCalendar}>
          Show Customer Calendar
        </Button>

        <Modal show={showCalendar} onHide={handleCloseCalendar} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Customer Calendar</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CustomerCalendar />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseCalendar}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <div>
        <ProfilenavBar />
      </div>

      <div style={{ marginLeft: '50px', padding: '20px', width: 'fit-content' }}>
        <h1>Orders</h1>
      </div>

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
