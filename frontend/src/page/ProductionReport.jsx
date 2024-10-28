import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

function ProductionReport() {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const startDate = new Date(params.get('start')).toISOString().split('T')[0]; // Extract date only
    const endDate = new Date(params.get('end')).toISOString().split('T')[0]; // Extract date only

    useEffect(() => {
        setLoading(true);
        setError(null); // Clear previous errors

        console.log(`Fetching production data for dates: ${startDate} to ${endDate}`);

        // Fetch data from the backend based on the selected date range
        axios.get(`http://localhost:8081/production_report?start=${startDate}&end=${endDate}`)
            .then(response => {
                console.log('Data fetched successfully:', response.data);
                setReportData(response.data);
                setLoading(false); // Stop loading after data is fetched
            })
            .catch(error => {
                console.error('Error fetching production data:', error);
                setError('Failed to load data. Please try again later.');
                setLoading(false); // Stop loading in case of an error
            });
    }, [startDate, endDate]);

    // Group data by date
    const groupedData = reportData.reduce((acc, record) => {
        const date = new Date(record.Date).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(record);
        return acc;
    }, {});

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>Report</Typography>

            {loading ? (
                <Typography variant="body1">Loading data...</Typography>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : Object.keys(groupedData).length === 0 ? (
                <Typography variant="body1">No production data available for the selected dates.</Typography>
            ) : (
                Object.keys(groupedData).map(date => (
                    <div key={date} style={{ marginBottom: '20px' }}>
                        <Typography variant="h6">Date: {date}</Typography>
                        <TableContainer component={Paper} style={{ marginTop: '10px' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Production ID</TableCell>
                                        <TableCell>Product</TableCell>
                                        <TableCell>Material Name</TableCell>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>Lot ID</TableCell>
                                        <TableCell>Lot Quantity</TableCell>
                                        <TableCell>Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {groupedData[date].map((record, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{record.productionId}</TableCell>
                                            <TableCell>{record.productName}</TableCell>
                                            <TableCell>{record.materialName}</TableCell>
                                            <TableCell>{record.materialQuantity}</TableCell>
                                            <TableCell>{record.lotId}</TableCell>
                                            <TableCell>{record.lotQuantity}</TableCell>
                                            <TableCell>{new Date(record.Date).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                ))
            )}
        </div>
    );
}

export default ProductionReport;
