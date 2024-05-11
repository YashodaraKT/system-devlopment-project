import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminBar from '../../component/AdminBar';

function AdminHome() {
    const Navigate= useNavigate();

  return (
    <div>
      <div><AdminBar/></div>
    </div>
  );
}

export default AdminHome;
