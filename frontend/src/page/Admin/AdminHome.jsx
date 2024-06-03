import React from 'react';
import  ProfilenavBar from '../../component/ProfilenavBar';
import AdminBar from '../../component/AdminBar';
import InvPieChart from '../../component/PieChart';

function AdminHome() {
  return (
    <div>
      <ProfilenavBar userType="admin" />
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
