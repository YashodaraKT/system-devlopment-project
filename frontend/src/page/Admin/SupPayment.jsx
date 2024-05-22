import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import NewSupply from '../../component/NewSupply';
import SupplyPrice from '../../component/SupplyPrice';
 // Import the new popup component

function ViewSupplierPayments() {
  const [supplies, setSupplies] = useState([]);
  const [showNewSupply, setShowNewSupply] = useState(false);
  const [showNewPopup, setShowNewPopup] = useState(false);  // State for new popup

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

  const handlePaymentStatusChange = async (supplyId, currentStatus, index) => {
    const newPaymentStatus = currentStatus === 0 ? 1 : 0;
    const updatedSupplies = [...supplies];
    updatedSupplies[index].Payment_Status = newPaymentStatus;
    setSupplies(updatedSupplies);
    try {
      const response = await axios.put(`http://localhost:8081/approved_supplier_payments/${supplyId}`, {
        Payment_Status: newPaymentStatus,
      });
      console.log('Payment status updated:', response.data);
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const handleShowNewSupply = () => setShowNewSupply(true);
  const handleCloseNewSupply = () => setShowNewSupply(false);

  const handleShowNewPopup = () => setShowNewPopup(true);  // Show new popup
  const handleCloseNewPopup = () => setShowNewPopup(false);  // Close new popup

  return (
    <div>
      <div style={{ marginLeft: '50px', padding: '20px', width: 'fit-content' }}>
        <h1>Supplier Payments</h1>
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
              <th>Supply Date</th>
              <th>Payment (LKR)</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {supplies.map((supply, index) => (
              <tr key={supply.Supply_ID}>
                <td>{supply.Supply_ID}</td>
                <td>{supply.Supplier_ID}</td>
                <td>{supply.Name}</td>
                <td>{supply.Contact_Number}</td>
                <td>{moment(supply.Date).format('MM/DD/YYYY')}</td>
                <td>{supply.Payment}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={supply.Payment_Status === 1}
                    onChange={() => handlePaymentStatusChange(supply.Supply_ID, supply.Payment_Status, index)}
                    style={{
                      accentColor: supply.Payment_Status === 1 ? 'green' : 'unset',
                    }}
                    disabled={supply.Payment_Status === 1}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <NewSupply show={showNewSupply} handleClose={handleCloseNewSupply} fetchSupplierPayments={fetchSupplierPayments} />
      <SupplyPrice show={showNewPopup} handleClose={handleCloseNewPopup} />  
    </div>
  );
}

export default ViewSupplierPayments;