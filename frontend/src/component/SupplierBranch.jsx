import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [supplierData, setSupplierData] = useState([]);
  const [locationIdInput, setlocationIdInput] = useState('');

  // Function to fetch supplier data based on location ID
  const fetchSupplierData = async (locationId) => {
    try {
      const response = await axios.get(`http://localhost:8081/suppliers_by_location?locationId=${locationId}`);
      setSupplierData(response.data);
    } catch (error) {
      console.error('Error fetching supplier data:', error);
    }
  };

  // Handler for form submit to fetch data
  const handleSubmit = (event) => {
    event.preventDefault();
    fetchSupplierData(locationIdInput);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ backgroundColor: 'pink', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
          <h1 style={{ color: 'black', fontSize: '1.5rem' }}>Suppliers by Location</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="locationId">Enter Location:</label>{' '}
            <input
              type="text"
              id="locationId"
              value={locationIdInput}
              onChange={(e) => setlocationIdInput(e.target.value)}
            />
            <button type="submit">Fetch Data</button>
          </form>
          <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '8px' }}>Location ID</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Count</th>
              </tr>
            </thead>
            <tbody>
              {supplierData.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{item.Location_ID}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </header>
    </div>
  );
}

export default App;
