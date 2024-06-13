import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PieChart = () => {
  const chartContainer = useRef(null); // Reference to the chart canvas
  const [chartInstance, setChartInstance] = useState(null); // State to hold the chart instance
  const [startDate, setStartDate] = useState(new Date()); // State for start date
  const [endDate, setEndDate] = useState(new Date()); // State for end date

  useEffect(() => {
    let newChartInstance = null;

    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/order_items?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
        const data = response.data;

        // Prepare data for Chart.js
        const labels = data.map(item => `Product ${item.Product_Name}: ${item.totalQuantity}`);
        const quantities = data.map(item => item.totalQuantity);

        // Ensure the chart container is available
        if (chartContainer.current) {
          // Destroy the previous chart instance if it exists
          if (chartInstance) {
            chartInstance.destroy();
          }

          // Create Chart.js pie chart
          const ctx = chartContainer.current.getContext('2d');
          newChartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
              labels: labels,
              datasets: [{
                data: quantities,
                backgroundColor: [
                  '#D60000',
                  '#F46300',
                  '#0358B6',
                  '#44DE28',
                  '#8A2BE2' // Add more colors if more products
                ],
              }]
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                  labels: {
                    // Set the legend labels to include the quantity
                    generateLabels: (chart) => {
                      const data = chart.data;
                      return data.labels.map((label, i) => ({
                        text: label,
                        fillStyle: data.datasets[0].backgroundColor[i],
                        hidden: isNaN(data.datasets[0].data[i]),
                        index: i
                      }));
                    }
                  }
                },
                // Disable the tooltip
                tooltip: {
                  enabled: false
                }
              }
            }
          });

          // Set the chart instance to state
          setChartInstance(newChartInstance);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // Cleanup on component unmount and before next effect run
    return () => {
      // Destroy the chart instance when component unmounts or before next effect run
      if (newChartInstance) {
        newChartInstance.destroy();
      }
    };
  }, [startDate, endDate]); // Include startDate and endDate in dependency array to fetch data when they change

  return (
    <div style={{ width: '350px', height: '400px' }}>
      <div style={{ marginBottom: '20px' }}>
        <DatePicker selected={startDate} onChange={date => setStartDate(date)} selectsStart startDate={startDate} endDate={endDate} />
        <DatePicker selected={endDate} onChange={date => setEndDate(date)} selectsEnd startDate={startDate} endDate={endDate} minDate={startDate} />
      </div>
      <canvas ref={chartContainer} id="myPieChart"></canvas>
    </div>
  );
};

export default PieChart;
