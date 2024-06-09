import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControlLabel, Checkbox } from '@mui/material';
import moment from 'moment';

function ScheduledAppointments() {
  const [userId, setUserId] = useState(null);
  const [supplierId, setSupplierId] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userJson = localStorage.getItem('user');
        if (!userJson) {
          throw new Error('User not found in local storage');
        }
        const user = JSON.parse(userJson);
        setUserId(user.User_ID);
      } catch (error) {
        console.error('Error fetching userId:', error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchSupplierId = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/supplier/${userId}`);
        setSupplierId(response.data.supplierId);
      } catch (error) {
        console.error('Error fetching supplierId:', error);
      }
    };

    if (userId) {
      fetchSupplierId();
    }
  }, [userId]);

  useEffect(() => {
    const fetchSupplierAppointments = async () => {
      try {
        if (supplierId) {
          const response = await axios.get(`http://localhost:8081/appointment/${supplierId}`);
          setAppointments(response.data.appointments);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    if (supplierId) {
      fetchSupplierAppointments();
    }
  }, [supplierId]);

  const handleStatusChange = async (appointmentId, status) => {
    try {
      await axios.put(`http://localhost:8081/appointment/${appointmentId}`, { status });
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.Appointment_ID === appointmentId
            ? { ...appointment, Approval: status }
            : appointment
        )
      );
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Appointment ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Approval</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.Appointment_ID}>
                <TableCell>{appointment.Appointment_ID}</TableCell>
                <TableCell>{moment(appointment.Date).format('MM/DD/YYYY')}</TableCell>
                <TableCell>{appointment.Size}</TableCell>
                <TableCell>{appointment.Approval === 'Accepted' ? 'Accepted' : 'Requested'}</TableCell>
                <TableCell>
                  {appointment.Approval === 'Accepted' && appointment.Selected_Time ?
                    (() => {
                      try {
                        console.log("Selected Time:", appointment.Selected_Time);
                        const formattedTime = moment(appointment.Selected_Time, 'HH:mm:ss').format('HH:mm:ss');
                        return formattedTime;
                      } catch (error) {
                        console.error('Error parsing time:', error);
                        return 'Invalid time';
                      }
                    })()
                    :
                    ''
                  }
                </TableCell>
                <TableCell>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => handleStatusChange(appointment.Appointment_ID, e.target.checked ? 'Completed' : 'Rejected')}
                        checked={appointment.Approval === 'Completed'}
                      />
                    }
                    label="Accept"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => handleStatusChange(appointment.Appointment_ID, e.target.checked ? 'Rejected' : 'Completed')}
                        checked={appointment.Approval === 'Rejected'}
                      />
                    }
                    label="Decline"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ScheduledAppointments;
