import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Alert } from 'react-bootstrap';
import EditProduct from '../../component/EditProduct';
import AdminBar from '../../component/AdminBar';
import ProfileBar from '../../component/ProfileBar';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [editModalShow, setEditModalShow] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    Product_Name: '',
    Cost: '',
    Selling_Price: '',
    Description: '',
    Image: null
  });

  const [errors, setErrors] = useState({});

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
    const { name, value, files } = e.target;
    if (name === 'Image') {
      setNewProduct({ ...newProduct, Image: files[0] });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const validate = () => {
    const errors = {};
    if (!newProduct.Product_Name) {
      errors.Product_Name = 'Product name is required';
    } else if (newProduct.Product_Name.length > 60) {
      errors.Product_Name = 'Product name must be less than 60 characters';
    }
    if (!newProduct.Selling_Price) {
      errors.Selling_Price = 'Selling price is required';
    } else if (isNaN(newProduct.Selling_Price)) {
      errors.Selling_Price = 'Selling price must be a number';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      const formData = new FormData();
      formData.append('Product_Name', newProduct.Product_Name);
      formData.append('Cost', newProduct.Cost);
      formData.append('Description', newProduct.Description);
      formData.append('Selling_Price', newProduct.Selling_Price);
      formData.append('Image', newProduct.Image);
  
      try {
        const response = await axios.post('http://localhost:8081/addProduct', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('New product added:', response.data);
        setProducts([...products, response.data]); // Add the new product to the list
        setNewProduct({ Product_Name: '', Cost: '', Selling_Price: '', Description: '', Image: null }); // Clear the form fields
      } catch (error) {
        console.error('Error adding new product:', error);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div>
      <div><ProfileBar pageName="Product" /></div>
      <div style={{ display: 'flex' }}>
        <div><AdminBar /></div>
        <div style={{ marginLeft: '20px', flexGrow: 1 }}>
          <h1>Product List</h1>
          {errors.Product_Name && <Alert variant="danger">{errors.Product_Name}</Alert>}
          {errors.Selling_Price && <Alert variant="danger">{errors.Selling_Price}</Alert>}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Selling Price</th>
                <th>Description</th>
                <th>Stock</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.Product_ID}>
                  <td>{product.Product_ID}</td>
                  <td>{product.Product_Name}</td>
                  <td>{product.Selling_Price}</td>
                  <td>{product.Description}</td>
                  <td>{product.In_Stock}</td>
                  <td>
                    {product.Image_Path && (
                      <img src={`http://localhost:8081/uploads/${product.Image_Path}`} alt={product.Product_Name} width="50" />
                    )}
                  </td>
                  <td>
                    <Button variant="primary" onClick={() => handleEdit(product)}>Edit</Button>{' '}
                   
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
                    name="Selling_Price"
                    value={newProduct.Selling_Price}
                    onChange={handleChange}
                    placeholder="Enter Selling Price"
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    name="Description"
                    value={newProduct.Description}
                    onChange={handleChange}
                    placeholder="Enter Description"
                  />
                </td>
                <td></td> {/* Leave the Stock cell empty */}
                <td>
                  <Form.Control
                    type="file"
                    name="Image"
                    onChange={handleChange}
                  />
                </td>
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
      </div>
    </div>
  );
}

export default ProductList;
