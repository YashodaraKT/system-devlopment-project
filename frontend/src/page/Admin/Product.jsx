import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form } from 'react-bootstrap';
import EditProduct from '../../component/EditProduct';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [editModalShow, setEditModalShow] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    Product_Name: '',
    Cost: '',
    Selling_Price: ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8081/viewProducts');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditModalShow(true);
  };

  const handleDelete = async (productId) => {
    try {
      await axios.put(`http://localhost:8081/deactivateProduct/${productId}`);
      setProducts(products.filter(product => product.Product_ID !== productId));
    } catch (error) {
      console.error('Error deactivating product:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/addProduct', newProduct);
      console.log('New product added:', response.data);
      setProducts([...products, response.data]); // Add the new product to the list
      setNewProduct({ Product_Name: '', Cost: '', Selling_Price: '' }); // Clear the form fields
    } catch (error) {
      console.error('Error adding new product:', error);
    }
  };

  return (
    <div>
      <h1>Product List</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Cost</th>
            <th>Selling Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.Product_ID}>
              <td>{product.Product_ID}</td>
              <td>{product.Product_Name}</td>
              <td>{product.Cost}</td>
              <td>{product.Selling_Price}</td>
              <td>{product.In_Stock}</td>
              <td>
                <Button variant="primary" onClick={() => handleEdit(product)}>Edit</Button>{' '}
                <Button variant="danger" onClick={() => handleDelete(product.Product_ID)}>Deactivate</Button>
              </td>
            </tr>
          ))}
          {/* Form for adding new product */}
          <tr>
            <td></td> {/* Leave the Product ID cell empty */}
            <td>
              <Form.Control
                type="text"
                name="Product_Name"
                value={newProduct.Product_Name}
                onChange={handleChange}
                placeholder="Enter Product Name"
              />
            </td>
            <td>
              <Form.Control
                type="text"
                name="Cost"
                value={newProduct.Cost}
                onChange={handleChange}
                placeholder="Enter Cost"
              />
            </td>
            <td>
              <Form.Control
                type="text"
                name="Selling_Price"
                value={newProduct.Selling_Price}
                onChange={handleChange}
                placeholder="Enter Selling Price"
              />
            </td>
            <td></td> {/* Leave the Stock cell empty */}
            <td>
              <Button variant="success" onClick={handleSubmit}>Add</Button>
            </td>
          </tr>
        </tbody>
      </Table>
      {selectedProduct && (
        <EditProduct
          show={editModalShow}
          onHide={() => setEditModalShow(false)}
          product={selectedProduct}
          fetchProducts={() => {
            const fetchProducts = async () => {
              try {
                const response = await axios.get('http://localhost:8081/viewProducts');
                setProducts(response.data);
              } catch (error) {
                console.error('Error fetching products:', error);
              }
            };
            fetchProducts();
          }}
        />
      )}
    </div>
  );
}

export default ProductList;
