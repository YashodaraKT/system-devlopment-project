import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container,Button } from 'react-bootstrap';
import StaffRegistration from '../../component/StaffRegistration';
import AdminBar from '../../component/AdminBar';

function ViewStaff() {
 
  const [modalShow, setModalShow] = useState(false);
  const [staffs, setStaffs] = useState([]);
  

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('http://localhost:8081/viewstaff');
      setStaffs(result.data);
    };

    fetchData();
  }, []);


  return (

    <div>
    <div><AdminBar/></div>
    <Container className="mt-5"> 
      <h1>Registered staff members</h1>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        Add Staff
      </Button>
      <br></br>
      <br></br>
      <Table striped bordered hover>
        <thead>
          <tr>
          <th>ID</th>
            <th>Name</th>
            <th>Contact Number</th>
          </tr>
        </thead>
        <tbody>
          {staffs.map((staff) => (
            <tr key={staff.Staff_ID}>
                <td>{staff.Staff_ID}</td>
              <td>{staff.Name}</td>
              <td>{staff.Contact_Number}</td>
          
            </tr>
          ))}
        </tbody>
        </Table>
      <StaffRegistration
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </Container>
    </div>
  );
}

export default ViewStaff;
