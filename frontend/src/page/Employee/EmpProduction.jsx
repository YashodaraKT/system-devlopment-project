import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container, Button, Modal } from 'react-bootstrap';
import ProductInv from '../../component/ProductInv';
import EmpBar from '../../component/EmpBar';
import ProfilenavBar from '../../component/ProfilenavBar';

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
  const [userId, setUserId] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]); // State to manage expanded rows

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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.User_ID) {
      setUserId(user.User_ID);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduction({ ...newProduction, [name]: value });
  };

  const handleSubmit = async () => {
    if (userId) {
      try {
        await axios.post('http://localhost:8081/addproduction', {
          ...newProduction,
          A_User_ID: userId
        });
        const updatedProductions = await axios.get('http://localhost:8081/viewproduction');
        setProductions(updatedProductions.data);
        setNewProduction({ Product_ID: '', Date: '', Quantity: '' });
      } catch (error) {
        console.error('Error adding production:', error);
      }
    } else {
      console.error('User ID not found in local storage.');
    }
  };

  const handleShowProductInv = () => {
    setShowProductInv(true);
  };

  const handleCloseProductInv = () => {
    setShowProductInv(false);
  };

  const toggleRow = (index) => {
    const currentExpandedRows = expandedRows;
    const isRowCurrentlyExpanded = currentExpandedRows.includes(index);
    const newExpandedRows = isRowCurrentlyExpanded
      ? currentExpandedRows.filter(id => id !== index)
      : currentExpandedRows.concat(index);
    setExpandedRows(newExpandedRows);
  };

  return (
    <div>
      <div><ProfilenavBar userType="employee" /></div>
      <div style={{ display: 'flex' }}>
        <div><EmpBar /></div>
        <div style={{ marginLeft: '20px', flexGrow: 1 }}>
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
                  <React.Fragment key={`${production.Product_ID}-${production.Date}-${index}`}>
                    <tr>
                      <td onClick={() => toggleRow(index)} style={{ cursor: 'pointer' }}>
                        {production.Product_Name}
                      </td>
                      <td>{new Date(production.Date).toLocaleDateString()}</td>
                      <td>{production.Quantity}</td>
                      <td></td>
                    </tr>
                    {expandedRows.includes(index) && (
                      <tr>
                        <td colSpan="4">
                          <div>
                            <strong>Entered by:</strong> {production.EnteredBy}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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
      </div>
    </div>
  );
}

export default Production;
