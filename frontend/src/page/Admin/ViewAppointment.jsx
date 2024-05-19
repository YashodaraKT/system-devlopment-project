import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Table from 'react-bootstrap/Table';

function ViewAppointment() {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
      const fetchVAppointments = async () => {
        try {
          const response = await axios.get('http://localhost:8081/view_appointment');
          setAppointments(response.data);
        } catch (error) {
          console.error('Error fetching appointments:', error);
          toast.error('Error fetching appointments. Please try again later.');
        }
      };
  
      fetchVAppointments();
    }, []);
  return (
    <div>
      <h1>Appointments</h1>
      <Table>
        <thead>
          <tr>
            <th>Appointment ID</th>
            <th>Supplier ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>No. of Days</th>
            <th>Supplier Name</th>
            <th>Address 1</th>
            <th>Address 2</th>
            <th>Location ID</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(appointment => (
            <tr key={appointment.Appointment_ID}>
              <td>{appointment.Appointment_ID}</td>
              <td>{appointment.Supplier_ID}</td>
              <td>{appointment.Date}</td>
              <td>{appointment.Status}</td>
              <td>{appointment.No_of_Days}</td>
              <td>{appointment.Name}</td>
              <td>{appointment.Address1}</td>
              <td>{appointment.Address2}</td>
              <td>{appointment.Location_Id}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default ViewAppointment;
