import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmpBar from '../../component/EmpBar';
import ProfileBar from '../../component/ProfileBar';
import PieChart from '../../component/PieChart';
import Process from '../../component/Process';
import Dash from '../../component/Dash';
import SupplierBranch from '../../component/SupplierBranch';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function AdminHome() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [revenueStartDate, setRevenueStartDate] = useState(null);
    const [revenueEndDate, setRevenueEndDate] = useState(null);
    const navigate = useNavigate();

    const handleGenerateProductionReport = () => {
        if (startDate && endDate) {
            console.log("Navigating to Production Report with dates:", startDate, endDate);
            navigate(`/ProductionReport?start=${startDate.toISOString()}&end=${endDate.toISOString()}`);
        }
    };

    const handleGenerateRevenueReport = () => {
        if (revenueStartDate && revenueEndDate) {
            console.log("Navigating to Revenue Report with dates:", revenueStartDate, revenueEndDate);
            navigate(`/RevenueReport?start=${revenueStartDate.toISOString()}&end=${revenueEndDate.toISOString()}`);
        }
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '350px', height: '350px' }}>
                                <h2>Production Report</h2>
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    placeholderText="Select Start Date"
                                />
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    placeholderText="Select End Date"
                                />
                                <button onClick={handleGenerateProductionReport} disabled={!startDate || !endDate}>
                                    Generate Production Report
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '350px', height: '350px' }}>
                                <h2>Revenue Report</h2>
                                <DatePicker
                                    selected={revenueStartDate}
                                    onChange={(date) => setRevenueStartDate(date)}
                                    placeholderText="Select Start Date"
                                />
                                <DatePicker
                                    selected={revenueEndDate}
                                    onChange={(date) => setRevenueEndDate(date)}
                                    placeholderText="Select End Date"
                                />
                                <button onClick={handleGenerateRevenueReport} disabled={!revenueStartDate || !revenueEndDate}>
                                    Generate Revenue Report
                                </button>
                            </div>
                            <div style={{ width: '350px', height: '350px' }}>
                                <h2>Sales</h2>
                                <PieChart />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                            <div style={{ width: '350px', height: '350px' }}>
                                <h2>Processing</h2>
                                <Process />
                            </div>
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
