import React from 'react';
import  ProfileBar from '../../component/ProfileBar';
import AdminBar from '../../component/AdminBar';
import InvPieChart from '../../component/PieChart';


function AdminHome() {


  return (
    <div>
      <ProfileBar pageName="Home" />
      <div style={{ display: 'flex' }}>
        <AdminBar />
        <div style={{ marginLeft: '20px', flexGrow: 1 }}>
          <InvPieChart />
        </div>
        
      </div>
    </div>
  );
}

export default AdminHome;
