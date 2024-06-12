import React from 'react';
import ProfileBar from '../../component/ProfileBar';
import AdminBar from '../../component/AdminBar';
import PieChart from '../../component/PieChart';
import Process from '../../component/Process';

function AdminHome() {
  return (
    <div>
      <ProfileBar pageName="Home" />
      <div style={{ display: 'flex' }}>
        <div>
          <AdminBar />
        </div>
        <div style={{ flexGrow: 1, padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          <div style={{ width: '350px', height: '350px' }}>
            <h2>Sales</h2>
            <PieChart />
          </div>
          <div style={{ width: '350px', height: '350px' }}>
            <h2>Sales</h2>
            <Process />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
