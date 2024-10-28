import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container, Button, Row, Col } from 'react-bootstrap';
import ProductInv from '../../component/ProductInv';
import EmpBar from '../../component/EmpBar';
import ProfileBar from '../../component/ProfileBar';

function Production() {
  const [productInventory, setProductInventory] = useState([]);
  const [productions, setProductions] = useState([]);
  const [newProduction, setNewProduction] = useState({
    Product_ID: '',
    Date: '',
    Quantity: ''
  });
  const [newMaterials, setNewMaterials] = useState([{ RawMaterial: '', MaterialQuantity: '' }]);
  const [fishConsumption, setFishConsumption] = useState('');
  const [products, setProducts] = useState([]);
  const [rawMaterialNames, setRawMaterialNames] = useState([]);
  const [showProductInv, setShowProductInv] = useState(false);
  const [userId, setUserId] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);
  const [materialRows, setMaterialRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data...');
        const productionResult = await axios.get('http://localhost:8081/viewproduction');
        setProductions(productionResult.data);

        const productResult = await axios.get('http://localhost:8081/productsdw');
        setProducts(productResult.data);

        const rawMaterialResult = await axios.get('http://localhost:8081/getRawMaterialNames');
        setRawMaterialNames(rawMaterialResult.data);

        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.User_ID) {
          setUserId(user.User_ID);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const fetchProductInventory = async () => {
    try {
      const response = await axios.get('http://localhost:8081/total_products');
      setProductInventory(response.data);
    } catch (error) {
      console.error('Error fetching product inventory:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduction({ ...newProduction, [name]: value });
  };

  const handleMaterialChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMaterials = [...newMaterials];
    updatedMaterials[index][name] = value;
    setNewMaterials(updatedMaterials);
  };

  const addNewMaterialRow = () => {
    setNewMaterials([...newMaterials, { RawMaterial: '', MaterialQuantity: '' }]);
  };

  const removeMaterialRow = (index) => {
    const updatedMaterials = newMaterials.filter((_, i) => i !== index);
    setNewMaterials(updatedMaterials);
  };

  const handleSubmit = async () => {
    if (userId) {
      try {
        // Add production entry and get the P_ID
        const productionResponse = await axios.post('http://localhost:8081/addproduction', {
          ...newProduction,
          A_User_ID: userId,
          Materials: newMaterials
        });

        const P_ID = productionResponse.data.P_ID; // Store the new production ID

        // Ensure fishConsumption is a number and greater than zero
        const fishQuantity = Number(fishConsumption);
        if (isNaN(fishQuantity) || fishQuantity <= 0) {
          alert('Please enter a valid fish quantity to consume.');
          return;
        }

        // Consume fish quantity and insert into production_fish
        const response = await axios.post('http://localhost:8081/consumeFish', {
          P_ID, // Pass the new production ID here
          fishQuantity
        });

        if (response.status === 200) {
          alert(response.data.message); // Show success message
        } else {
          alert('Failed to reduce fish quantity: ' + response.data.message);
        }

        // Update production list and reset fields
        const updatedProductions = await axios.get('http://localhost:8081/viewproduction');
        setProductions(updatedProductions.data);
        setNewProduction({ Product_ID: '', Date: '', Quantity: '' });
        setNewMaterials([{ RawMaterial: '', MaterialQuantity: '' }]);
        setFishConsumption('');
        setMaterialRows([]);
      } catch (error) {
        console.error('Error adding production or consuming fish:', error.response ? error.response.data : error.message);
        alert('Error adding production or consuming fish quantity from supply.');
      }
    } else {
      console.error('User ID not found in local storage.');
    }
  };

  const handleShowProductInv = () => {
    fetchProductInventory();
    setShowProductInv(true);
  };

  const handleCloseProductInv = () => {
    setShowProductInv(false);
  };

  const toggleRow = (index) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((id) => id !== index) : [...prev, index]
    );
  };

  const toggleMaterialRow = (index) => {
    setMaterialRows((prev) =>
      prev.includes(index) ? prev.filter((id) => id !== index) : [...prev, index]
    );
  };

  return (
    <div>
      <div><ProfileBar userType="employee" /></div>
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
                  <React.Fragment key={`${production.Product_Name}-${production.Date}-${index}`}>
                    <tr>
                      <td onClick={() => toggleRow(index)} style={{ cursor: 'pointer' }}>
                        {production.Product_Name}
                      </td>
                      <td>{new Date(production.Date).toLocaleDateString()}</td>
                      <td>{production.Quantity}</td>
                      <td>
                        <Button
                          variant="primary"
                          onClick={() => toggleMaterialRow(index)}
                        >
                          Materials
                        </Button>
                      </td>
                    </tr>
                    {materialRows.includes(index) && production.Materials && (
                      <tr>
                        <td colSpan="4">
                          {production.Materials.map((material, materialIndex) => (
                            <div key={materialIndex} className="mb-3">
                              <Row>
                                <Col md={6}>
                                  <strong>Material Name:</strong> {material.R_Name}
                                </Col>
                                <Col md={6}>
                                  <strong>Quantity:</strong> {material.MaterialQuantity}
                                </Col>
                              </Row>
                            </div>
                          ))}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </Table>
            <Row className="mt-4">
              <Col md={4}>
                <select
                  id="Product_ID"
                  name="Product_ID"
                  value={newProduction.Product_ID}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="">Select a product</option>
                  {products.map(product => (
                    <option key={product.Product_ID} value={product.Product_ID}>
                      {product.Product_Name}
                    </option>
                  ))}
                </select>
              </Col>
              <Col md={2}>
                <input
                  type="number"
                  id="Quantity"
                  name="Quantity"
                  value={newProduction.Quantity}
                  onChange={handleInputChange}
                  placeholder="Quantity"
                  className="form-control"
                />
              </Col>
            </Row>
            <Row className="mt-3">
  <Col md={4}>
    <input
      type="date"
      id="Date"
      name="Date"
      value={newProduction.Date}
      onChange={handleInputChange}
      className="form-control"
    />
  </Col>
</Row>

            {/* Fish Consumption Section */}
            <Row className="mt-3">
              <Col md={4}>
                <input
                  type="number"
                  name="fishConsumption"
                  value={fishConsumption}
                  onChange={(e) => setFishConsumption(e.target.value)}
                  placeholder="Enter fish quantity to consume"
                  className="form-control"
                />
              </Col>
            </Row>

            {/* Materials Section */}
            <div className="mt-3">
              {newMaterials.map((material, index) => (
                <Row key={index} className="mb-2">
                  <Col md={4}>
                    <select
                      name="RawMaterial"
                      value={material.RawMaterial}
                      onChange={(e) => handleMaterialChange(index, e)}
                      className="form-control"
                    >
                      <option value="">Select raw material</option>
                      {rawMaterialNames.map((materialName, i) => (
                        <option key={i} value={materialName}>
                          {materialName}
                        </option>
                      ))}
                    </select>
                  </Col>
                  <Col md={2}>
                    <input
                      type="number"
                      name="MaterialQuantity"
                      value={material.MaterialQuantity}
                      onChange={(e) => handleMaterialChange(index, e)}
                      placeholder="Quantity"
                      className="form-control"
                    />
                  </Col>
                  <Col md={2}>
                    <Button variant="danger" onClick={() => removeMaterialRow(index)}>
                      Remove
                    </Button>
                  </Col>
                </Row>
              ))}
              <Button variant="secondary" onClick={addNewMaterialRow}>Add Material</Button>
            </div>

            <Button variant="success" className="mt-3" onClick={handleSubmit}>Add Production</Button>
          </Container>
          {showProductInv && (
            <ProductInv onClose={handleCloseProductInv} productInventory={productInventory} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Production;
