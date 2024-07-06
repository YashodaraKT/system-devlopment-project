import React from 'react';
import { useNavigate } from 'react-router-dom';
import EmpBar from '../../component/EmpBar';
import ProfileBar from '../../component/ProfileBar';
import PieChart from '../../component/PieChart';
import Process from '../../component/Process';
import Dash from '../../component/Dash';
import SupplierBranch from '../../component/SupplierBranch';

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
        <div style={{ flexGrow: 1, padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          <div style={{ width: '350px', height: '350px' }}>
            <h2>Sales</h2>
            <PieChart />
          </div>
          <div style={{ width: '350px', height: '350px' }}>
          
            <Process />
          </div>
          <br/>
        
          <div style={{ width: '350px', height: '350px' }}>
            
            <Dash />
          </div>
          <div style={{ width: '350px', height: '350px' }}>
            
            <SupplierBranch />
          </div>
        </div>
        </div>
        </div>
      </div>
      </div>
      </div>
    );
  }

export default AdminHome;
