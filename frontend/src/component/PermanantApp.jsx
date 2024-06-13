import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import moment from 'moment';

function AppointmentsTable() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/api/per_appointments')
      .then(response => {
        setAppointments(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const getApprovalStyle = (approval) => {
    switch (approval) {
      case 1:
        return { color: 'green' };
      case 0:
        return { color: 'red' };
      case 10:
        return { color: 'gray' };
      default:
        return {};
    }
  };

  const getApprovalText = (approval) => {
    switch (approval) {
      case 1:
        return 'Accepted';
      case 0:
        return 'Rejected';
      case 10:
        return 'No Response';
      default:
        return 'Unknown';
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Contact Number</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Begin Date</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Approval</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.Appointment_ID}>
              <TableCell>{appointment.Appointment_ID}</TableCell>
              <TableCell>{appointment.Supplier_Name}</TableCell>
              <TableCell>{appointment.Contact_Number}</TableCell>
              <TableCell>{`${appointment.Address1}, ${appointment.Address2}`}</TableCell>
              <TableCell>{appointment.Location_Name}</TableCell>
              <TableCell>{moment(appointment.Begin_Date).format('YYYY-MM-DD')}</TableCell>
              <TableCell>{appointment.Reason}</TableCell>
              <TableCell style={getApprovalStyle(appointment.Approval)}>
                {getApprovalText(appointment.Approval)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AppointmentsTable;
