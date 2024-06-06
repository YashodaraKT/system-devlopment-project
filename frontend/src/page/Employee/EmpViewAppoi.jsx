import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import EmpBar from '../../component/EmpBar';
import ProfilenavBar from '../../component/ProfilenavBar';

const Accepted = 'Accepted';
const Rejected = 'Rejected';

function ViewAppointment() {
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

  return (
    <div>
     <div><ProfilenavBar userType="employee" /></div>
      <div style={{ display: 'flex' }}>
        <div><EmpBar /></div>
        <div style={{ marginLeft: '20px', flexGrow: 1 }}></div>
    <div className="container">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Appointment No</th>
            <th scope="col">Supplier Name</th>
            <th scope="col">Contact Number</th>
            <th scope="col">Address</th>
            <th scope="col">Location</th>
            <th scope="col">Date</th>
            <th scope="col">Time</th>
            <th scope="col">Approval</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(appointment => (
            <tr key={appointment.Appointment_ID}>
              <td>{appointment.Appointment_ID}</td>
              <td>{appointment.Name}</td>
              <td>{appointment.Contact_Number}</td>
              <td>{`${appointment.Address1}, ${appointment.Address2}`}</td>
              <td>{appointment.Location_Name}</td>
              <td>{moment(appointment.Date).format('MM/DD/YYYY')}</td>
              <td>
                <input 
                  type="time"
                  className="form-control"
                  value={appointment.Selected_Time}
                  onChange={(e) => handleTimeChange(appointment.Appointment_ID, e.target.value)}
                  disabled={disabledAppointments.has(appointment.Appointment_ID)}
                />
              </td>
              <td>
                <div className="form-check form-check-inline">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name={`approval-${appointment.Appointment_ID}`} 
                    id={`accept-${appointment.Appointment_ID}`} 
                    value="Accepted" 
                    checked={appointment.Approval === Accepted} 
                    onChange={() => handleApprovalChange(appointment.Appointment_ID, Accepted)} 
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
                    value="Rejected" 
                    checked={appointment.Approval === Rejected} 
                    onChange={() => handleApprovalChange(appointment.Appointment_ID, Rejected)} 
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

export default ViewAppointment;
