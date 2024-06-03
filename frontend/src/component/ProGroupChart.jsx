import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';


const ProductionChart = () => {
    const [chartData, setChartData] = useState(null);
    const [view, setView] = useState('week'); // Default to week view
  
    useEffect(() => {
      fetchData(view).then(data => {
        const productNames = data.map(item => item.Product_ID);
        const quantities = data.map(item => item.Quantity);
  
        // Group the data by day (for week view) or by week (for month view)
        const groupedData = quantities.reduce((acc, curr, i) => {
          const group = view === 'week' ? i % 7 : Math.floor(i / 7);
          acc[group] = (acc[group] || 0) + curr;
          return acc;
        }, []);
  
        const data = {
          labels: view === 'week' ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [
            {
              label: 'Production',
              data: groupedData,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)'
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
              ],
              borderWidth: 1
            }
          ]
        };
  
        setChartData(data);
      });
    }, [view]);
  
    const fetchData = async (view) => {
      try {
        const response = await axios.get(`http://localhost:8081/production/${view}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    return (
      <div>
        {/* Add buttons to switch between week and month views */}
        <button onClick={() => setView('week')}>Week View</button>
        <button onClick={() => setView('month')}>Month View</button>
  
        {/* Render the chart */}
        {chartData && <Bar data={chartData} />}
      </div>
    );
  };
  
  export default ProductionChart;
  