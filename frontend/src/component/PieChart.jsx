import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import 'chart.js/auto';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Container, Row, Col } from 'react-bootstrap'; // Import Bootstrap components
import { Box, Typography } from '@mui/material'; // Import MUI components

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChartComponent() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8081/productsdw')
      .then(response => {
        const productNames = response.data.map(item => item.Product_Name);
        const inStock = response.data.map(item => item.In_Stock);

        const data = {
          labels: productNames,
          datasets: [
            {
              label: 'In Stock',
              data: inStock,
              backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)',
                
              ],
              borderColor: 'black',
              borderWidth: 1,
            },
          ],
        };

        setChartData(data);
        console.log(chartData); // Print chartData to the console
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  return (
    <Container fluid className="p-4"> {/* Use Bootstrap Container and padding */}
      <Row> {/* Use Bootstrap Row */}
        <Col> {/* Use Bootstrap Col */}
          <Box
            sx={{
              backgroundColor: 'green',
              color: 'white',
              p: 1,
              mb: 2,
              borderRadius: 1,
            }}
          >
            {/* Use MUI Box and styling */}
            <Typography variant="h5">Product Inventory</Typography> {/* Use MUI Typography */}
          </Box>
        </Col>
      </Row>
      <Row> {/* Use Bootstrap Row */}
        <Col> {/* Use Bootstrap Col */}
          {chartData && (
            <Pie data={chartData} options={options} redraw />
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default PieChartComponent;
