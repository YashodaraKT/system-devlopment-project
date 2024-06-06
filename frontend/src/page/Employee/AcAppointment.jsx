import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import PendingAppE from '../../component/PendingAppE';
import CompleteAppE from '../../component/CompleteAppE';
import RejectedE from '../../component/RejectedE';
import EmpBar from '../../component/EmpBar';
import ProfilenavBar from '../../component/ProfilenavBar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Radio, RadioGroup, FormControlLabel } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import 'bootstrap/dist/css/bootstrap.min.css';

const Accepted = 'Accepted';
const Rejected = 'Rejected';

const ColorTabs = ({ value, onChange }) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={value}
        onChange={onChange}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="secondary tabs example"
      >
        <Tab value="appointments" label=" Requested Transports" />
        <Tab value="pendingapp" label="Pending Transports" />
        <Tab value="completeAppE" label="Completed Transports" />
        <Tab value="rejectedE" label="Rejected Transports" />
        {/* Add more tabs as needed */}
      </Tabs>
    </Box>
  );
};

function ViewAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [disabledAppointments, setDisabledAppointments] = useState(new Set());
  const [tabValue, setTabValue] = useState('appointments');

  useEffect(() => {
    axios.get('http://localhost:8081/view_appointment')
      .then(res => {
        setAppointments(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const handleApprovalChange = (appointmentId, approval) => {
    const userId = JSON.parse(localStorage.getItem('user')).User_ID;

    axios.post('http://localhost:8081/update_appointment', {
      appointmentId: appointmentId,
      approval: approval,
      selectedTime: appointments.find(appointment => appointment.Appointment_ID === appointmentId).Selected_Time,
      userId: userId
    })
    .then(res => {
      console.log(res.data.message);
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment.Appointment_ID === appointmentId 
            ? { ...appointment, Approval: approval } 
            : appointment
        )
      );
      setDisabledAppointments(prevDisabled => new Set(prevDisabled).add(appointmentId));
    })
    .catch(err => {
      console.log(err);
    });
  };

  const handleTimeChange = (appointmentId, selectedTime) => {
    setAppointments(prevAppointments => 
      prevAppointments.map(appointment => 
        appointment.Appointment_ID === appointmentId 
          ? { ...appointment, Selected_Time: selectedTime } 
          : appointment
      )
    );
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div>
      <div><ProfilenavBar userType="employee" /></div>
      <div style={{ display: 'flex' }}>
        <div><EmpBar /></div>
        <div style={{ marginLeft: '20px', flexGrow: 1 }}>
          <ColorTabs value={tabValue} onChange={handleTabChange} />
          {tabValue === 'appointments' && (
            <div className="container">
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: 150 }}>Appointment No</TableCell>
                      <TableCell sx={{ width: 150 }}>Supplier Name</TableCell>
                      <TableCell sx={{ width: 150 }}>Contact Number</TableCell>
                      <TableCell sx={{ width: 150 }}>Address</TableCell>
                      <TableCell sx={{ width: 150 }}>Location</TableCell>
                      <TableCell sx={{ width: 150 }}>Date</TableCell>
                      <TableCell sx={{ width: 150 }}>Time</TableCell>
                      <TableCell sx={{ width: 150 }}>Approval</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appointments.map(appointment => (
                      <TableRow
                        key={appointment.Appointment_ID}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row" sx={{ width: 150 }}>
                          {appointment.Appointment_ID}
                        </TableCell>
                        <TableCell sx={{ width: 150 }}>{appointment.Name}</TableCell>
                        <TableCell sx={{ width: 150 }}>{appointment.Contact_Number}</TableCell>
                        <TableCell sx={{ width: 150 }}>{`${appointment.Address1}, ${appointment.Address2}`}</TableCell>
                        <TableCell sx={{ width: 150 }}>{appointment.Location_Name}</TableCell>
                        <TableCell sx={{ width: 150 }}>{moment(appointment.Date).format('MM/DD/YYYY')}</TableCell>
                        <TableCell sx={{ width: 150 }}>
                          <input 
                            type="time"
                            className="form-control"
                            value={appointment.Selected_Time}
                            onChange={(e) => handleTimeChange(appointment.Appointment_ID, e.target.value)}
                            disabled={disabledAppointments.has(appointment.Appointment_ID)}
                          />
                        </TableCell>
                        <TableCell sx={{ width: 150 }}>
                          <RadioGroup
                            row
                            name={`approval-${appointment.Appointment_ID}`}
                            value={appointment.Approval}
                            onChange={(e) => handleApprovalChange(appointment.Appointment_ID, e.target.value)}
                          >
                            <FormControlLabel
                              value={Accepted}
                              control={<Radio />}
                              label="Accept"
                              disabled={disabledAppointments.has(appointment.Appointment_ID)}
                            />
                            <FormControlLabel
                              value={Rejected}
                              control={<Radio />}
                              label="Decline"
                              disabled={disabledAppointments.has(appointment.Appointment_ID)}
                            />
                          </RadioGroup>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              </div>
          )}
          {tabValue === 'pendingapp' && (
            <div>
              <PendingAppE />
            </div>
          )}
          {tabValue === 'completeAppE' && (
            <div>
              <CompleteAppE />
            </div>
          )}
          {tabValue === 'rejectedE' && (
            <div>
              <RejectedE />
            </div>
          )}
          {tabValue === 'other' && (
            <div>
              {/* Render other content here */}
              <p>Other content goes here...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewAppointment;