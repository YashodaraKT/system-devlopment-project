import React, { useState, useEffect } from 'react';
import SupplierNBar from '../../component/SupplierNBar';
import axios from 'axios';
import moment from 'moment';
import {
  Table,
  Card,
  Col,
  Row,
  Form,
  FormControl,
  Button,
} from 'react-bootstrap';

function Spayment() {
  const [supplies, setSupplies] = useState([]);
  const [supplierId, setSupplierId] = useState(null);
  const [paidPayments, setPaidPayments] = useState(0);
  const [unpaidPayments, setUnpaidPayments] = useState(0);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  const fetchSupplierId = async () => {
    try {
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        throw new Error('User not found in local storage');
      }
      const user = JSON.parse(userJson);
      const userId = user.User_ID;
      const response = await axios.get(`http://localhost:8081/supplier/${userId}`);
      const supplierId = response.data.supplierId;
      setSupplierId(supplierId);
    } catch (error) {
      console.error('Error fetching supplierId:', error);
    }
  };

  const fetchSupplierSupplies = async () => {
    try {
      let url = `http://localhost:8081/supply/${supplierId}`;

      if (selectedYear && selectedMonth) {
        url += `?year=${selectedYear}&month=${selectedMonth}`;
      } else if (selectedYear) {
        url += `?year=${selectedYear}`;
      } else if (selectedMonth) {
        url += `?month=${selectedMonth}`;
      }

      const response = await axios.get(url);
      setSupplies(response.data.supplies);
    } catch (error) {
      console.error('Error fetching supplies:', error);
    }
  };

  useEffect(() => {
    fetchSupplierId();
  }, []);

  useEffect(() => {
    if (supplierId) {
      fetchSupplierSupplies();
    }
  }, [supplierId, selectedYear, selectedMonth]);

  useEffect(() => {
    if (supplies.length > 0) {
      let totalPaid = 0;
      let totalUnpaid = 0;

      supplies.forEach((supply) => {
        if (supply.Payment_Status === 1) {
          totalPaid += supply.Payment;
        } else {
          totalUnpaid += supply.Payment;
        }
      });

      setPaidPayments(totalPaid);
      setUnpaidPayments(totalUnpaid);
    }
  }, [supplies]);

  const totalPayments = paidPayments + unpaidPayments;

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setSelectedMonth('');
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div>
      <div>
        <SupplierNBar userType="supplier" />
      </div>

      <Row className="justify-content-center mt-4">
        <Col xs={12} md={4} className="mb-3">
          <Card>
            <Card.Body>
              <h6>Paid Payments</h6>
              <h4>Rs {paidPayments.toFixed(2)}</h4>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={4} className="mb-3">
          <Card>
            <Card.Body>
              <h6>Unpaid Payments</h6>
              <h4>Rs {unpaidPayments.toFixed(2)}</h4>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={4} className="mb-3">
          <Card>
            <Card.Body>
              <h6>Total Payments</h6>
              <h4>Rs {totalPayments.toFixed(2)}</h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center mt-4">
        <Col xs={12} md={4} className="mb-3">
          <Form>
            <Form.Label>Year</Form.Label>
            <Form.Select
              value={selectedYear}
              onChange={handleYearChange}
            >
              <option value="">All</option>
              <option value={moment().format('YYYY')}>
                {moment().format('YYYY')}
              </option>
              <option value={moment().subtract(1, 'year').format('YYYY')}>
                {moment().subtract(1, 'year').format('YYYY')}
              </option>
              {/* Add more years as needed */}
            </Form.Select>
          </Form>
        </Col>

        <Col xs={12} md={4} className="mb-3">
          <Form>
            <Form.Label>Month</Form.Label>
            <Form.Select
              value={selectedMonth}
              onChange={handleMonthChange}
            >
              <option value="">All</option>
              {moment.months().map((month, index) => (
                <option key={index} value={index + 1}>{month}</option>
              ))}
            </Form.Select>
          </Form>
        </Col>
      </Row>

      <Row className="justify-content-center mt-4">
        <Col xs={12} className="mb-3">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Supply Number</th>
                <th>Quantity(kg)</th>
                <th>Date</th>
                <th>Value(Rs)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {supplies.map((supply) => (
                <tr key={supply.Supply_ID}>
                  <td>{supply.Supply_ID}</td>
                  <td>{supply.Quantity}</td>
                  <td>{moment(supply.Date).format('DD-MMM-YYYY')}</td>
                  <td>{supply.Payment}</td>
                  <td>
                    <span
                      className={`badge bg-${supply.Payment_Status === 1 ? 'success' : 'danger'}`}
                    >
                      {supply.Payment_Status === 1 ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  );
}

export default Spayment;
