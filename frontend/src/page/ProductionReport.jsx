import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function ProductionReport() {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const startDate = new Date(params.get('start')).toISOString().split('T')[0];
    const endDate = new Date(params.get('end')).toISOString().split('T')[0];

    useEffect(() => {
        setLoading(true);
        setError(null);

        axios.get(`http://localhost:8081/production_report?start=${startDate}&end=${endDate}`)
            .then(response => {
                setReportData(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError('Failed to load data. Please try again later.');
                setLoading(false);
            });
    }, [startDate, endDate]);

    // Group data by productionId within each date
    const groupedData = reportData.reduce((acc, record) => {
        const date = new Date(record.Date).toLocaleDateString();
        if (!acc[date]) acc[date] = new Map();
        const productionGroup = acc[date];
        if (!productionGroup.has(record.productionId)) productionGroup.set(record.productionId, []);
        productionGroup.get(record.productionId).push(record);
        return acc;
    }, {});

    // Function to generate PDF
    const generatePDF = () => {
        const doc = new jsPDF();

        // Define the columns for the PDF
        const columns = [
            { header: 'Product ID', dataKey: 'productionId' },
            { header: 'Product', dataKey: 'productName' },
            { header: 'Material Name', dataKey: 'materialName' },
            { header: 'Quantity', dataKey: 'materialQuantity' },
            { header: 'LOT ID', dataKey: 'lotId' },
            { header: 'LOT Quantity', dataKey: 'lotQuantity' },
            { header: 'Lot Price', dataKey: 'lotPrice' },
            { header: 'Cost', dataKey: 'cost' },
            { header: 'Fish Quantity', dataKey: 'fishQuantity' },
            { header: 'Fish Lot ID', dataKey: 'fishLotId' },
            { header: 'Fish Lot Quantity', dataKey: 'fishLotQuantity' },
            { header: 'Fish Lot Price', dataKey: 'fishLotPrice' },
            { header: 'Fish Cost', dataKey: 'fishCost' },
            { header: 'Total Cost', dataKey: 'totalCost' },
        ];

        // Prepare the data for each date
        const reportDataFormatted = Object.keys(groupedData).flatMap(date => {
            return [...groupedData[date]].flatMap(([productionId, records]) => {
                let lastProductionId = null;
                let lastProductName = null;

                return records.map(record => {
                    const rowData = {
                        productionId: productionId,
                        productName: record.productName,
                        materialName: record.materialName,
                        materialQuantity: record.materialQuantity,
                        lotId: record.lotId,
                        lotQuantity: record.lotQuantity,
                        lotPrice: record.lotPrice,
                        cost: record.cost,
                        fishQuantity: record.fishQuantity,
                        fishLotId: record.fishLotId,
                        fishLotQuantity: record.fishLotQuantity,
                        fishLotPrice: record.fishLotPrice,
                        fishCost: record.fishCost,
                        totalCost: record.totalCost,
                    };

                    // If the productionId or productName hasn't changed, don't repeat it
                    if (productionId === lastProductionId) {
                        rowData.productionId = ''; // Clear Product ID if the same
                        rowData.productName = '';   // Clear Product Name if the same
                    } else {
                        lastProductionId = productionId;
                        lastProductName = record.productName;
                    }

                    return rowData;
                });
            });
        });

        // Check if reportDataFormatted has the expected structure
        console.log(reportDataFormatted); // Log this to see the data structure

        // Use jspdf-autotable to add a table to the PDF
        doc.autoTable(columns, reportDataFormatted);

        // Save the PDF
        doc.save('production_report.pdf');
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>Production Report</Typography>
            <Button variant="contained" color="primary" onClick={generatePDF} style={{ marginBottom: '20px' }}>
                Download Report
            </Button>

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
                                        <TableCell>Product ID</TableCell>
                                        <TableCell>Product</TableCell>
                                        <TableCell style={{ borderLeft: '2px solid #000' }}>Material Name</TableCell>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>LOT ID</TableCell>
                                        <TableCell>LOT Quantity</TableCell>
                                        <TableCell>Lot Price</TableCell>
                                        <TableCell>Cost</TableCell>
                                        <TableCell style={{ borderLeft: '2px solid #000' }}>Fish Quantity</TableCell>
                                        <TableCell>Fish Lot ID</TableCell>
                                        <TableCell>Fish Lot Quantity</TableCell>
                                        <TableCell>Fish Lot Price</TableCell>
                                        <TableCell>Fish Cost</TableCell>
                                        <TableCell style={{ borderLeft: '2px solid #000' }}>Total Cost</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {[...groupedData[date]].map(([productionId, records]) => (
                                        records.map((record, index) => (
                                            <TableRow key={index}>
                                                {index === 0 && (
                                                    <>
                                                        <TableCell rowSpan={records.length}>{productionId}</TableCell>
                                                        <TableCell rowSpan={records.length}>{record.productName}</TableCell>
                                                    </>
                                                )}
                                                {index === 0 || record.materialName !== records[index - 1].materialName ? (
                                                    <>
                                                        <TableCell style={{ borderLeft: '2px solid #000' }}>{record.materialName}</TableCell>
                                                        <TableCell>{record.materialQuantity}</TableCell>
                                                    </>
                                                ) : (
                                                    <>
                                                        <TableCell></TableCell>
                                                        <TableCell></TableCell>
                                                    </>
                                                )}
                                                <TableCell>{record.lotId}</TableCell>
                                                <TableCell>{record.lotQuantity}</TableCell>
                                                <TableCell>{record.lotPrice}</TableCell>
                                                <TableCell>{record.cost}</TableCell>
                                                {index === 0 && (
                                                    <>
                                                        <TableCell style={{ borderLeft: '2px solid #000' }} rowSpan={records.length}>{record.fishQuantity}</TableCell>
                                                        <TableCell rowSpan={records.length}>{record.fishLotId}</TableCell>
                                                        <TableCell rowSpan={records.length}>{record.fishLotQuantity}</TableCell>
                                                        <TableCell rowSpan={records.length}>{record.fishLotPrice}</TableCell>
                                                        <TableCell rowSpan={records.length}>{record.fishCost}</TableCell>
                                                        <TableCell style={{ borderLeft: '2px solid #000' }} rowSpan={records.length}>{record.totalCost}</TableCell>
                                                    </>
                                                )}
                                            </TableRow>
                                        ))
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
