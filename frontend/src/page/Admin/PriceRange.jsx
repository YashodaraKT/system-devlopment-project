import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, IconButton } from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import AdminBar from '../../component/AdminBar';
import ProfileBar from '../../component/ProfileBar';

function App() {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({ Location_Name: '', Price: '', Price_WT: '' });
  const [editingLocation, setEditingLocation] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8081/api/location_price')
      .then(response => {
        setLocations(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the locations!', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLocation({ ...newLocation, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/api/location_price', newLocation)
      .then(response => {
        setLocations([...locations, response.data]);
        setNewLocation({ Location_Name: '', Price: '', Price_WT: '' });
      })
      .catch(error => {
        console.error('There was an error adding the location!', error);
      });
  };

  const handleEditChange = (e, id) => {
    const { name, value } = e.target;
    setEditingLocation({
      ...editingLocation,
      [id]: { ...editingLocation[id], [name]: value }
    });
  };

  const startEditing = (id) => {
    setEditingLocation({
      ...editingLocation,
      [id]: locations.find(location => location.ID === id)
    });
  };

  const saveEdit = (id) => {
    const { Price, Price_WT } = editingLocation[id];
    axios.put(`http://localhost:8081/api/location_price/${id}`, { Price, Price_WT })
      .then(response => {
        setLocations(locations.map(location => location.ID === id ? response.data : location));
        setEditingLocation(null);
      })
      .catch(error => {
        console.error('There was an error updating the location!', error);
      });
  };

  const cancelEdit = (id) => {
    setEditingLocation({ ...editingLocation, [id]: null });
  };

  return (
    <div>
      <div><ProfileBar pageName="Price Range"/></div>
      <div style={{ display: 'flex' }}>
      <div><AdminBar /></div>
      <div style={{ flexGrow: 1 }}></div>
    <Container>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Location Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Price(Without Transport)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {locations.map((location) => (
              <TableRow key={location.ID}>
                <TableCell>{location.ID}</TableCell>
                <TableCell>{location.Location_Name}</TableCell>
                <TableCell>
                  {editingLocation && editingLocation[location.ID] ? (
                    <TextField
                      name="Price"
                      value={editingLocation[location.ID].Price}
                      onChange={(e) => handleEditChange(e, location.ID)}
                    />
                  ) : (
                    location.Price
                  )}
                </TableCell>
                <TableCell>
                  {editingLocation && editingLocation[location.ID] ? (
                    <TextField
                      name="Price_WT"
                      value={editingLocation[location.ID].Price_WT}
                      onChange={(e) => handleEditChange(e, location.ID)}
                    />
                  ) : (
                    location.Price_WT
                  )}
                </TableCell>
                <TableCell>
                  {editingLocation && editingLocation[location.ID] ? (
                    <>
                      <IconButton onClick={() => saveEdit(location.ID)}>
                        <SaveIcon />
                      </IconButton>
                      <IconButton onClick={() => cancelEdit(location.ID)}>
                        <CancelIcon />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton onClick={() => startEditing(location.ID)}>
                      <EditIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Location Name"
          name="Location_Name"
          value={newLocation.Location_Name}
          onChange={handleInputChange}
          required
        />
        <TextField
          label="Price"
          name="Price"
          value={newLocation.Price}
          onChange={handleInputChange}
          required
        />
        <TextField
          label="Price WT"
          name="Price_WT"
          value={newLocation.Price_WT}
          onChange={handleInputChange}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Add Location
        </Button>
      </form>
    </Container>
    </div>
        </div>
     
  );
}

export default App;
