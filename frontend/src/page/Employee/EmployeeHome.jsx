import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmpBar from '../../component/EmpBar';
import ProfileBar from '../../component/ProfileBar';
import PieChart from '../../component/PieChart';
import Process from '../../component/Process';
import Dash from '../../component/Dash';
import SupplierBranch from '../../component/SupplierBranch';
import DatePicker from 'react-datepicker'; // Import the date picker
import "react-datepicker/dist/react-datepicker.css"; // Import the styles for date picker

function AdminHome() {
    const [startDate, setStartDate] = useState(null); // State for start date
    const [endDate, setEndDate] = useState(null); // State for end date
    const navigate = useNavigate();

    const handleGenerateReport = () => {
      navigate(`/ProductionReport?start=${startDate.toISOString()}&end=${endDate.toISOString()}`);
  };
  

    return (
        <div>
            <div>
                <ProfileBar pageName="Home" />
            </div>
            <div>
                <div style={{ display: 'flex' }}>
                    <div><EmpBar /></div>
                    <div style={{ marginLeft: '20px', flexGrow: 1 }}>
                        {/* First Row: Report, Sales, and Processing */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',width: '350px', height: '350px'}}>
                            <h2>Production Report</h2>
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    placeholderText="Select Start Date"
                                />
                                {/* Date Picker for End Date */}
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    placeholderText="Select End Date"
                                />
                                {/* Button to generate report */}
                                <button onClick={handleGenerateReport} disabled={!startDate || !endDate}>
                                    Generate Report
                                </button>
                            </div>
                            <div style={{ width: '350px', height: '350px' }}>
                                <h2>Sales</h2>
                                <PieChart />
                            </div>
                            <div style={{ width: '350px', height: '350px' }}>
                                <h2>Processing</h2>
                                <Process />
                            </div>
                        </div>

                        {/* Second Row: Dashboard and Supplier Branch */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                            <div style={{ width: '350px', height: '350px' }}>
                                <h2>Dashboard</h2>
                                <Dash />
                            </div>
                            <div style={{ width: '350px', height: '350px' }}>
                                <h2>Supplier Branch</h2>
                                <SupplierBranch />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminHome;
