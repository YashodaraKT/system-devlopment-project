import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PermanantApp from '../../component/PermanantApp';
import ProfileBar from '../../component/ProfileBar';  
import EmpBar from '../../component/EmpBar';
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

function FTest() {
  const [appointments, setAppointments] = useState(() => {
    const storedAppointments = localStorage.getItem('appointments');
    return storedAppointments ? JSON.parse(storedAppointments) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState(0);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    setIsLoading(true);
    axios.get('http://localhost:8081/api/p_appointments')
      .then(response => {
        console.log('Fetched appointments:', response.data);
        setAppointments(response.data);
        localStorage.setItem('appointments', JSON.stringify(response.data));
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching appointments:', error);
        setIsLoading(false);
      });
  };

  const handleApprovalChange = (appointmentId, approvalValue) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    axios.put(`http://localhost:8081/api/p_appointments/${appointmentId}`, { approval: approvalValue })
      .then(response => {
        console.log('Updated appointment:', response.data);
        setAppointments(prevAppointments => {
          return prevAppointments.map(appointment => {
            if (appointment.Appointment_ID === appointmentId) {
              return { ...appointment, Approval: approvalValue };
            }
            return appointment;
          });
        });
        localStorage.setItem('appointments', JSON.stringify(appointments));
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error updating appointment:', error);
        setIsLoading(false);
      });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <div><ProfileBar userType="employee" /></div>
      <div style={{ display: 'flex' }}>
        <div><EmpBar /></div>
        <div style={{ marginLeft: '20px', flexGrow: 1 }}></div>
    <Container>
      <h4>Appointments</h4>
      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
        <Tab label="Appointments" {...a11yProps(0)} />
        <Tab label="Another Tab" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Contact Number</th>
              <th>Address</th>
              <th>Location</th>
              <th>Begin Date</th>
              <th>Reason</th>
              <th>Approval</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(appointment => (
              <tr key={appointment.Appointment_ID}>
                <td>{appointment.Appointment_ID}</td>
                <td>{appointment.Supplier_Name}</td>
                <td>{appointment.Contact_Number}</td>
                <td>{`${appointment.Address1}, ${appointment.Address2}`}</td>
                <td>{appointment.Location_Name}</td>
                <td>{moment(appointment.Begin_Date).format('YYYY-MM-DD')}</td>
                <td>{appointment.Reason}</td>
                <td>
                  <Form.Check
                    type="checkbox"
                    label="Accept"
                    checked={appointment.Approval === 1}
                    onChange={() => handleApprovalChange(appointment.Appointment_ID, 1)}
                  />
                  <Form.Check
                    type="checkbox"
                    label="Decline"
                    checked={appointment.Approval === 0}
                    onChange={() => handleApprovalChange(appointment.Appointment_ID, 0)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <PermanantApp />
      </TabPanel>
    </Container>
    </div>
    </div>
  );
}

export default FTest;
