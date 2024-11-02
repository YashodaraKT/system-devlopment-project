import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

function RevenueReport() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const params = new URLSearchParams(window.location.search);
            const start = params.get('start');
            const end = params.get('end');

            if (!start || !end) {
                console.error('Start and end dates are required');
                return;
            }

            try {
                const response = await fetch(`http://localhost:8081/revenue?start=${start}&end=${end}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                // Organize data by Order_ID and Product_Name, calculating cost for each P_ID
                const groupedOrders = data.reduce((acc, order) => {
                    const { Order_ID, Deliver_Date, Payment, Product_Name, Order_Quantity, Lot_Quantity, Production_No, Production_Cost, Production_Quantity } = order;

                    let existingOrder = acc.find(o => o.Order_ID === Order_ID);

                    if (!existingOrder) {
                        existingOrder = {
                            Order_ID,
                            Deliver_Date,
                            Payment,
                            products: [],
                        };
                        acc.push(existingOrder);
                    }

                    let existingProduct = existingOrder.products.find(p => p.Product_Name === Product_Name && p.Order_Quantity === Order_Quantity);

                    if (!existingProduct) {
                        existingProduct = { Product_Name, Order_Quantity, productionDetails: [] };
                        existingOrder.products.push(existingProduct);
                    }

                    // Calculate unit price and cost
                    const unitPrice = Production_Cost / Production_Quantity;
                    const calculatedCost = unitPrice * Lot_Quantity;

                    existingProduct.productionDetails.push({ Production_No, Lot_Quantity, Calculated_Cost: calculatedCost });

                    return acc;
                }, []);

                // Calculate total costs and profit for each order
                groupedOrders.forEach(order => {
                    order.totalCostOfGoods = order.products.reduce((sum, product) =>
                        sum + product.productionDetails.reduce((pSum, detail) => pSum + detail.Calculated_Cost, 0), 0
                    );
                    order.profit = order.Payment - order.totalCostOfGoods;
                });

                setOrders(groupedOrders);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div>
            <Typography variant="h4" gutterBottom>Revenue Report</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Deliver Date</TableCell>
                            <TableCell>Payment</TableCell>
                            <TableCell>Product Name</TableCell>
                            <TableCell>Order Quantity</TableCell>
                            <TableCell>Production No</TableCell>
                            <TableCell>Lot Quantity</TableCell>
                            <TableCell>Calculated Cost</TableCell>
                            <TableCell>Cost of Goods</TableCell>
                            <TableCell>Profit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <React.Fragment key={order.Order_ID}>
                                {order.products.map((product, productIndex) => (
                                    <React.Fragment key={productIndex}>
                                        {product.productionDetails.map((detail, detailIndex) => (
                                            <TableRow key={detailIndex}>
                                                {/* Only display Order_ID, Deliver_Date, Payment once per order */}
                                                {productIndex === 0 && detailIndex === 0 && (
                                                    <>
                                                        <TableCell rowSpan={order.products.reduce((sum, p) => sum + p.productionDetails.length, 0)}>
                                                            {order.Order_ID}
                                                        </TableCell>
                                                        <TableCell rowSpan={order.products.reduce((sum, p) => sum + p.productionDetails.length, 0)}>
                                                            {new Date(order.Deliver_Date).toLocaleDateString()}
                                                        </TableCell>
                                                        <TableCell rowSpan={order.products.reduce((sum, p) => sum + p.productionDetails.length, 0)}>
                                                            {order.Payment}
                                                        </TableCell>
                                                    </>
                                                )}
                                                {/* Only display Product Name and Order Quantity once per product */}
                                                {detailIndex === 0 && (
                                                    <>
                                                        <TableCell rowSpan={product.productionDetails.length}>
                                                            {product.Product_Name}
                                                        </TableCell>
                                                        <TableCell rowSpan={product.productionDetails.length}>
                                                            {product.Order_Quantity}
                                                        </TableCell>
                                                    </>
                                                )}
                                                <TableCell>{detail.Production_No}</TableCell>
                                                <TableCell>{detail.Lot_Quantity}</TableCell>
                                                <TableCell>{detail.Calculated_Cost.toFixed(2)}</TableCell>
                                                {/* Display total cost of goods and profit only once per order */}
                                                {productIndex === 0 && detailIndex === 0 && (
                                                    <>
                                                        <TableCell rowSpan={order.products.reduce((sum, p) => sum + p.productionDetails.length, 0)}>
                                                            {order.totalCostOfGoods.toFixed(2)}
                                                        </TableCell>
                                                        <TableCell rowSpan={order.products.reduce((sum, p) => sum + p.productionDetails.length, 0)}>
                                                            {order.profit.toFixed(2)}
                                                        </TableCell>
                                                    </>
                                                )}
                                            </TableRow>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default RevenueReport;
