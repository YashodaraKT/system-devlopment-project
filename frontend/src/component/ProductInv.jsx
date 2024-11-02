import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';

function ProductInv({ show, handleClose, productionData }) {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Product Inventory</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Total Quantity</th>
            </tr>
          </thead>
          <tbody>
            {productionData && productionData.length > 0 ? (
              productionData.map((production, index) => (
                <tr key={index}>
                  <td>{production.Product_Name}</td>
                  <td>{production.totalQuantity}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProductInv;
