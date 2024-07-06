import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container, Button } from 'react-bootstrap';
import StaffRegistration from '../../component/StaffRegistration';
import AdminBar from '../../component/AdminBar';
import UpdateStaff from '../../component/UpdateStaff';
import ProfileBar from '../../component/ProfileBar';

function ViewStaff() {
  const [modalShow, setModalShow] = useState(false);
  const [staffs, setStaffs] = useState([]);
  const [editModalShow, setEditModalShow] = useState(false); // State for edit modal
  const [selectedStaff, setSelectedStaff] = useState(null); // State for the selected staff

  const fetchStaff = async () => {
    const result = await axios.get('http://localhost:8081/viewstaff');
    setStaffs(result.data);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleEditClick = (staff) => {
    setSelectedStaff(staff);
    setEditModalShow(true);
  };

  return (
    <div>
      <div><ProfileBar pageName="Staff" /></div>
      <div style={{ display: 'flex' }}>
        <div><AdminBar /></div>
        <div style={{ marginLeft: '20px', flexGrow: 1 }}>
          <Container className="mt-5">
            <h1>Registered staff members</h1>
            <Button variant="primary" onClick={() => setModalShow(true)}>
              Add Staff
            </Button>
            <br />
            <br />
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Contact Number</th>
                
                  <th>Actions</th> {/* Add Actions column */}
                </tr>
              </thead>
              <tbody>
                {staffs.map((staff) => (
                  <tr key={staff.Staff_ID}>
                    <td>{staff.Staff_ID}</td>
                    <td>{staff.Name}</td>
                    <td>{staff.Contact_Number}</td>
                 
                    <td>
                      <Button
                        variant="secondary"
                        onClick={() => handleEditClick(staff)}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <StaffRegistration
              show={modalShow}
              onHide={() => setModalShow(false)}
            />
            {selectedStaff && (
              <UpdateStaff
                show={editModalShow}
                onHide={() => setEditModalShow(false)}
                staffId={selectedStaff.Staff_ID}
                currentContact={selectedStaff.Contact_Number}
                fetchStaff={fetchStaff}
              />
            )}
          </Container>
        </div>
      </div>
    </div>
  );
}

export default ViewStaff;
