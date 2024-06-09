import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import NewSupply from '../../component/NewSupply';
import SupplyPrice from '../../component/SupplyPrice';
import EmpBar from '../../component/EmpBar';
import ProfileBar from '../../component/ProfileBar';

function ViewSupplierPayments() {
  const [supplies, setSupplies] = useState([]);
  const [showNewSupply, setShowNewSupply] = useState(false);
  const [showNewPopup, setShowNewPopup] = useState(false);
  const [priceWithTransport, setPriceWithTransport] = useState('');
  const [priceWithoutTransport, setPriceWithoutTransport] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentSupply, setCurrentSupply] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRows, setExpandedRows] = useState([]);
  const [userId, setUserId] = useState(''); // State to store User_ID

  useEffect(() => {
    const savedPriceWithoutTransport = localStorage.getItem("priceWithoutTransport");
    const savedPriceWithTransport = localStorage.getItem("priceWithTransport");

    if (savedPriceWithoutTransport) {
      setPriceWithoutTransport(savedPriceWithoutTransport);
    }

    if (savedPriceWithTransport) {
      setPriceWithTransport(savedPriceWithTransport);
    }

    // Retrieve User_ID from local storage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.User_ID);
    }
  }, []);

  const fetchSupplierPayments = async () => {
    try {
      const response = await axios.get('http://localhost:8081/supplier_payments');
      console.log('Supplier payment data:', response.data);
      setSupplies(response.data.supplies);
    } catch (error) {
      console.error('Error fetching supplier payments:', error);
    }
  };

  useEffect(() => {
    fetchSupplierPayments();
  }, []);

  const handleShowConfirmModal = (supply, index) => {
    setCurrentSupply(supply);
    setCurrentIndex(index);
    setShowConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const handleConfirmChange = async () => {
    const newPaymentStatus = currentSupply.Payment_Status === 0 ? 1 : 0;
    const updatedSupplies = [...supplies];
    const updatedSupply = { ...currentSupply, Payment_Status: newPaymentStatus, U_User_ID: userId, Payment_Date: moment().format('YYYY-MM-DD') }; // Add User_ID and Payment_Date
    updatedSupplies[currentIndex] = updatedSupply;
    setSupplies(updatedSupplies);
    setShowConfirmModal(false);

    try {
      const response = await axios.put(`http://localhost:8081/approved_supplier_payments/${currentSupply.Supply_ID}`, {
        Payment_Status: newPaymentStatus,
        U_User_ID: userId,
        Payment_Date: moment().format('YYYY-MM-DD')
      });
      console.log('Payment status updated:', response.data);
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const handleShowNewSupply = () => setShowNewSupply(true);
  const handleCloseNewSupply = () => setShowNewSupply(false);

  const handleShowNewPopup = () => setShowNewPopup(true);
  const handleCloseNewPopup = () => setShowNewPopup(false);

  const handlePriceWithTransportChange = (value) => {
    setPriceWithTransport(value);
  };

  const handlePriceWithoutTransportChange = (value) => {
    setPriceWithoutTransport(value);
  };

  // Function to handle search query change
  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Toggle expanded row
  const toggleExpandedRow = (index) => {
    const isExpanded = expandedRows.includes(index);
    const newExpandedRows = isExpanded
      ? expandedRows.filter((rowIndex) => rowIndex !== index)
      : [...expandedRows, index];
    setExpandedRows(newExpandedRows);
  };

  // Function to filter supplies based on search query
  const filteredSupplies = supplies.filter((supply) => {
    const searchRegex = new RegExp(searchQuery, 'i'); // Case insensitive search
    return (
      searchRegex.test(supply.Name) ||
      searchRegex.test(supply.RegisteredBy) ||
      searchRegex.test(supply.Contact_Number.toString())
    );
  });

  return (
    <div>
      <div><ProfileBar userType="employee" /></div>
  <div style={{ display: 'flex' }}>
    <div><EmpBar /></div>
    <div style={{ marginLeft: '20px', flexGrow: 1 }}>
      <div style={{ marginLeft: '50px', padding: '20px', width: 'fit-content' }}>
        <h1 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Supplier Payments</h1>
          <Form.Group style={{ marginBottom: 0, marginLeft: 'auto' }}>
            <Form.Control
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchQueryChange}
            />
          </Form.Group>
            <Button variant="secondary" onClick={handleShowNewPopup} style={{ marginRight: '10px' }}>
              Show Popup
            </Button>
            <Button variant="primary" onClick={handleShowNewSupply}>
              Add New Supply
            </Button>
          </div>
          <div style={{ marginLeft: '50px', padding: '20px', width: 'fit-content' }}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Supply ID</th>
                  <th>Supplier ID</th>
                  <th>Supplier Name</th>
                  <th>Contact Number</th>
                  <th>Quantity</th>
                  <th>Supply Date</th>
                  <th>Payment (LKR)</th>
                  <th>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredSupplies.map((supply, index) => (
                  <React.Fragment key={supply.Supply_ID}>
                    <tr onClick={() => toggleExpandedRow(index)}>
                      <td>{supply.Supply_ID}</td>
                      <td>{supply.Supplier_ID}</td>
                      <td>{supply.Name}</td>
                      <td>{supply.Contact_Number}</td>
                      <td>{supply.Quantity}</td>
                      <td>{moment(supply.Date).format('MM/DD/YYYY')}</td>
                      <td>{supply.Payment}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={supply.Payment_Status === 1}
                          onChange={() => handleShowConfirmModal(supply, index)}
                          style={{
                            accentColor: supply.Payment_Status === 1 ? 'green' : 'unset',
                          }}
                        />
                      </td>
                    </tr>
                    {expandedRows.includes(index) && (
                      <tr>
                        <td colSpan="8">
                          Add By: {supply.RegisteredBy}<br/>
                         Paid By: {supply.PaidBy}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </Table>

          </div>
          <NewSupply show={showNewSupply} handleClose={handleCloseNewSupply} fetchSupplierPayments={fetchSupplierPayments} priceWithTransport={priceWithTransport} priceWithoutTransport={priceWithoutTransport} />
          <SupplyPrice
            show={showNewPopup}
            handleClose={handleCloseNewPopup}
            setPriceWithTransport={setPriceWithTransport}
            setPriceWithoutTransport={setPriceWithoutTransport}
            priceWithoutTransport={priceWithoutTransport}
            priceWithTransport={priceWithTransport}
          />
          <Modal show={showConfirmModal} onHide={handleCloseConfirmModal}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Status Change</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to change the payment status?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseConfirmModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirmChange}>
                Confirm
              </Button>
            </Modal.Footer>

          </Modal>
        </div>
      </div>
    </div>
  );
}

export default ViewSupplierPayments;
