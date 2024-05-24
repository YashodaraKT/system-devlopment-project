import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container, Button, Modal } from 'react-bootstrap';
import AdminBar from '../../component/AdminBar';
import ProductInv from '../../component/ProductInv';

function Production() {
  const [productions, setProductions] = useState([]);
  const [productionData, setProductionData] = useState([]);
  const [newProduction, setNewProduction] = useState({
    Product_ID: '',
    Date: '',
    Quantity: ''
  });
  const [products, setProducts] = useState([]);
  const [showProductInv, setShowProductInv] = useState(false);

  useEffect(() => {
    const fetchProductionData = async () => {
      try {
        const response = await axios.get('http://localhost:8081/calculateTotalQuantity');
        setProductionData(response.data);
      } catch (error) {
        console.error('Error fetching production data:', error);
      }
    };

    fetchProductionData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const productionResult = await axios.get('http://localhost:8081/viewproduction');
      setProductions(productionResult.data);

      

      const productResult = await axios.get('http://localhost:8081/productsdw');
      setProducts(productResult.data);
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduction({ ...newProduction, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:8081/addproduction', newProduction);
      const updatedProductions = await axios.get('http://localhost:8081/viewproduction');
      setProductions(updatedProductions.data);
      setNewProduction({ Product_ID: '', Date: '', Quantity: '' });
    } catch (error) {
      console.error('Error adding production:', error);
    }
  };

  const handleShowProductInv = () => {
    setShowProductInv(true);
  };

  const handleCloseProductInv = () => {
    setShowProductInv(false);
  };

  return (
    <div>
      <AdminBar />
      <Container className="mt-5">
        <h1>Production Records</h1>
        <Button variant="secondary" onClick={handleShowProductInv}>Product Inventory</Button>
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Date</th>
              <th>Quantity</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {productions.map((production, index) => (
              <tr key={`${production.Product_ID}-${production.Date}-${index}`}>
                <td>{production.Product_Name}</td>
                <td>{new Date(production.Date).toLocaleDateString()}</td>
                <td>{production.Quantity}</td>
                <td></td>
              </tr>
            ))}
            <tr>
              <td>
                <select
                  name="Product_ID"
                  value={newProduction.Product_ID}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product.Product_ID} value={product.Product_ID}>
                      {product.Product_Name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="date"
                  name="Date"
                  value={newProduction.Date}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </td>
              <td>
                <input
                  type="number"
                  name="Quantity"
                  value={newProduction.Quantity}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </td>
              <td>
                <Button variant="primary" onClick={handleSubmit}>Add</Button>
              </td>
            </tr>
          </tbody>
        </Table>
      </Container>
      <Modal show={showProductInv} onHide={handleCloseProductInv}>
        <Modal.Header closeButton>
          <Modal.Title>Product Inventory</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProductInv productionData={productionData} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseProductInv}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Production;
