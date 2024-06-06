import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import 'bootstrap/dist/css/bootstrap.min.css';

function PendingApp() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/view_penappointment')
      .then(res => {
        setAppointments(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <div>
    
      <div style={{ display: 'flex' }}>
       
        <div style={{ marginLeft: '20px', flexGrow: 1 }}></div>
        <div className="container">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Appointment No</TableCell>
                  <TableCell>Supplier Name</TableCell>
                  <TableCell>Contact Number</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map(appointment => (
                  <TableRow
                    key={appointment.Appointment_ID}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {appointment.Appointment_ID}
                    </TableCell>
                    <TableCell>{appointment.Name}</TableCell>
                    <TableCell>{appointment.Contact_Number}</TableCell>
                    <TableCell>{`${appointment.Address1}, ${appointment.Address2}`}</TableCell>
                    <TableCell>{appointment.Location_Name}</TableCell>
                    <TableCell>{moment(appointment.Date).format('MM/DD/YYYY')}</TableCell>
                    <TableCell>{appointment.Selected_Time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}

export default PendingApp;
