import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminBar from '../../component/AdminBar';
import ProfilenavBar from '../../component/ProfilenavBar';

function AdminHome() {
    const Navigate= useNavigate();

  return (
    <div>
      <div><ProfilenavBar userType="admin" /></div>
      <div><AdminBar/></div>
    </div>
  );
}

export default AdminHome;
