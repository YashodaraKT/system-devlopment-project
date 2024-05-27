import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import AdminBar from '../../component/AdminBar';
import ProfilenavBar from '../../component/ProfilenavBar';

function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [disabledAppointments, setDisabledAppointments] = useState(new Set());

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
    axios.post('http://localhost:8081/update_appointment', {
      appointmentId: appointmentId,
      approval: approval
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

  return (
    <div>
     <div><ProfilenavBar userType="admin" /></div>
      <div style={{ display: 'flex' }}>
        <div><AdminBar /></div>
        <div style={{ marginLeft: '20px', flexGrow: 1 }}></div>
    <div className="container">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Appointment No</th>
            <th scope="col">Supplier ID</th>
            <th scope="col">Supplier Name</th>
            <th scope="col">Address</th>
            <th scope="col">Status</th>
            <th scope="col">Location</th>
            <th scope="col">Date</th>
            <th scope="col">Approval</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(appointment => (
            <tr key={appointment.Appointment_ID}>
              <td>{appointment.Appointment_ID}</td>
              <td>{appointment.Supplier_ID}</td>
              <td>{appointment.Name}</td>
              <td>{`${appointment.Address1}, ${appointment.Address2}`}</td>
              <td>{appointment.Status === 0 ? 'Temporary' : 'Permanent'}</td>
              <td>{appointment.Location_Name}</td>
              <td>{moment(appointment.Date).format('MM/DD/YYYY')}</td>
              <td>
                <div className="form-check form-check-inline">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name={`approval-${appointment.Appointment_ID}`} 
                    id={`accept-${appointment.Appointment_ID}`} 
                    value="1" 
                    checked={appointment.Approval === 1} 
                    onChange={() => handleApprovalChange(appointment.Appointment_ID, 1)} 
                    disabled={disabledAppointments.has(appointment.Appointment_ID)} 
                  />
                  <label className="form-check-label" htmlFor={`accept-${appointment.Appointment_ID}`}>Accept</label>
                </div>
                <div className="form-check form-check-inline">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name={`approval-${appointment.Appointment_ID}`} 
                    id={`decline-${appointment.Appointment_ID}`} 
                    value="0" 
                    checked={appointment.Approval === 0} 
                    onChange={() => handleApprovalChange(appointment.Appointment_ID, 0)} 
                    disabled={disabledAppointments.has(appointment.Appointment_ID)} 
                  />
                  <label className="form-check-label" htmlFor={`decline-${appointment.Appointment_ID}`}>Decline</label>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div></div>
  );
}

export default AppointmentList;
