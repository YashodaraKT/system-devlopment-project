import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [counts, setCounts] = useState({ customerCount: 'Loading...', supplierCount: 'Loading...' });

  useEffect(() => {
    async function fetchCounts() {
      try {
        const response = await axios.get('http://localhost:8081/counts');
        setCounts({
          customerCount: response.data.customerCount,
          supplierCount: response.data.supplierCount
        });
      } catch (error) {
        console.error('Error fetching counts:', error);
        setCounts({ customerCount: 'Error', supplierCount: 'Error' });
      }
    }

    fetchCounts();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
      <div style={{ backgroundColor: 'pink', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
  <h1 style={{ color: 'black', fontSize: '1.5rem' }}>Total Customers: <span>{counts.customerCount}</span></h1>
  <h1 style={{ color: 'black', fontSize: '1.5rem' }}>Total Suppliers: <span>{counts.supplierCount}</span></h1>
</div>
</header>
</div>
  );
}

export default App;
