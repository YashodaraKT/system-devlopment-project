import React from 'react';
import { useNavigate } from 'react-router-dom';
import EmpBar from '../../component/EmpBar';
import ProfilenavBar from '../../component/ProfilenavBar';

function AdminHome() {
    const Navigate= useNavigate();

    return (
      <div>
        <div><ProfilenavBar userType="admin" /></div>
        <div style={{ display: 'flex' }}>
          <div><EmpBar /></div>
          <div style={{ marginLeft: '20px', flexGrow: 1 }}>
        <div style={{ width: '400px', height: '400px', margin: '0 auto' }}>
       
        </div>
      </div>
      </div>
      </div>
    );
  }

export default AdminHome;
