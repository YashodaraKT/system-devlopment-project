import React, { useState, useEffect } from 'react';
import CustomerBar from '../../component/CustomerBar';
import { Modal, Button, Form, Tooltip, OverlayTrigger } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CusPayment() {
  const [products, setProducts] = useState([]);
  const [formFields, setFormFields] = useState([{ id: 1, product: '', quantity: '' }]);
  const [ordervalue, setOrderValue] = useState(0);
  const [deliverDate, setDeliverDate] = useState('');
  const [customerId, setCustomerId] = useState(null);

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
    const newId = formFields.length + 1;
    setFormFields([...formFields, { id: newId, product: '', quantity: '' }]);
  };

  const removeFormField = (id) => {
    const updatedFields = formFields.filter((field) => field.id !== id);
    setFormFields(updatedFields);
    calculateOrderValue(updatedFields);
  };

  const handleFormChange = (id, event) => {
    const updatedFields = formFields.map((field) =>
      field.id === id ? { ...field, [event.target.name]: event.target.value } : field
    );
    setFormFields(updatedFields);
    calculateOrderValue(updatedFields);
  };

  const calculateOrderValue = (fields) => {
    let total = 0;
    fields.forEach((field) => {
      const product = products.find((p) => p.Product_Name === field.product);
      if (product && field.quantity) {
        total += product.Selling_Price * field.quantity;
      }
    });
    setOrderValue(total);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate deliverDate to be a future date
    const currentDate = moment().format('YYYY-MM-DD');
    if (moment(deliverDate).isBefore(currentDate, 'day')) {
      toast.error('Invalid date. Please select a future date.');
      return;
    }

    // Validate quantity to be multiple of 10 and at least 10
    let isValidQuantity = true;
    formFields.forEach((field) => {
      const quantity = parseInt(field.quantity);
      if (quantity < 10 || quantity % 10 !== 0) {
        isValidQuantity = false;
      }
    });

    if (!isValidQuantity) {
      toast.error('Invalid quantity. Quantity should be at least 10 and in multiples of 10.');
      return;
    }

    // If all validations pass, proceed with submitting the order
    const orderDate = moment().format('YYYY-MM-DD');
    try {
      const orderItems = formFields.map((field) => {
        const product = products.find((p) => p.Product_Name === field.product);
        const quantity = parseInt(field.quantity);
        return {
          Product_ID: product.Product_ID,
          Quantity: quantity,
          Value: quantity * product.Selling_Price,
        };
      });

      const orderData = {
        Customer_ID: customerId,
        Order_Date: orderDate,
        Deliver_Date: deliverDate,
        orderItems: orderItems,
      };

      console.log('Order data:', orderData);
      await axios.post('http://localhost:8081/enter_customer_order', orderData);
      toast.success('Order placed successfully!');
      setFormFields([{ id: 1, product: '', quantity: '' }]);
      setDeliverDate('');
      setOrderValue(0);
      fetchCustomerOrders();
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Error submitting order.');
    }
  };

  return (
    <div>
      <div>
        <CustomerBar />
      </div>
      <br />
      <br />
      <div style={{ textAlign: 'center' }}>
        <h1>Orders</h1>
      </div>
      <div
        style={{
          margin: 'auto',
          border: '1px solid black',
          padding: '20px',
          width: 'fit-content',
          fontSize: '20px',
        }}
      >
        <Form onSubmit={handleSubmit}>
          {formFields.map((field, index) => (
            <div key={field.id} className="d-flex flex-row align-items-center mb-3">
              <Form.Group className="flex-fill" controlId={`formBasicType${field.id}`}>
                <Form.Label>Product</Form.Label>
                <Form.Select
                  name="product"
                  value={field.product}
                  onChange={(e) => handleFormChange(field.id, e)}
                >
                  <option>Select the Product</option>
                  {products.map((product) => (
                    <option key={product.Product_Name} value={product.Product_Name}>
                      {product.Product_Name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="flex-fill ms-3" controlId={`formBasicTime${field.id}`}>
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  placeholder="Add the Quantity"
                  value={field.quantity}
                  onChange={(e) => handleFormChange(field.id, e)}
                />
              </Form.Group>

              {index === formFields.length - 1 && (
                <Button variant="secondary" onClick={addFormField} className="ms-2" title="Add more products">
                  +
                </Button>
              )}

              {formFields.length > 1 && (
                <Button
                  variant="danger"
                  onClick={() => removeFormField(field.id)}
                  className="ms-2"
                  title="Remove this product"
                >
                  X
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

          <Form.Group controlId="formBasicCheckbox" style={{ fontSize: '14px' }}>
            <Form.Check type="checkbox" label="I agree with the price levels" required />
          </Form.Group>

          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="tooltip-submit">Submit your order</Tooltip>}
          >
            <Button
              variant="primary"
              type="submit"
              className="submit-button"
              style={{ backgroundColor: '#1F618D', textAlign: 'center' }}
            >
              Submit
            </Button>
          </OverlayTrigger>
        </Form>

        <div style={{ marginTop: '20px' }}>
          <h3>Order Value: Rs {ordervalue.toFixed(2)}</h3>
        </div>
      </div>
      <ToastContainer className="custom-toast-container" />
    </div>
  );
}

export default CusPayment;
