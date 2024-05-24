import React from 'react';
import { useNavigate } from 'react-router-dom';
import EmpBar from '../../component/EmpBar';

function AdminHome() {
    const Navigate= useNavigate();

  return (
    <div>
      <div><EmpBar/></div>
    </div>
  );
}

export default AdminHome;
