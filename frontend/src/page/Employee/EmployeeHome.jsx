import React from 'react';
import { useNavigate } from 'react-router-dom';
import EmpBar from '../../component/EmpBar';
import ProfileBar from '../../component/ProfileBar';

function AdminHome() {
    const Navigate= useNavigate();

    return (
      <div>
        <div><ProfileBar pageName="Home"  />
        
        </div>
        <div>
      
        <div style={{ display: 'flex' }}>
          <div><EmpBar /></div>
          <div style={{ marginLeft: '20px', flexGrow: 1 }}>
        <div style={{ width: '400px', height: '400px', margin: '0 auto' }}>
        </div>
        </div>
      </div>
      </div>
      </div>
    );
  }

export default AdminHome;
