import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, IconButton } from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import AdminBar from '../../component/AdminBar';
import ProfileBar from '../../component/ProfileBar';

function App() {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({ Location_Name: '', Price: '', Price_WT: '' });
  const [editingLocation, setEditingLocation] = useState(null);
  const [errors, setErrors] = useState({});

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
    
    // Validate inputs
    if (name === 'Location_Name' && value.length > 30) {
      setErrors({ ...errors, [name]: 'Location name must be less than 30 characters' });
    } else if ((name === 'Price' || name === 'Price_WT') && isNaN(value)) {
      setErrors({ ...errors, [name]: 'Price must be a number' });
    } else {
      setErrors({ ...errors, [name]: '' });
    }
    
    setNewLocation({ ...newLocation, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Final validation check before submitting
    const { Location_Name, Price, Price_WT } = newLocation;
    if (Location_Name.length > 30) {
      setErrors({ ...errors, Location_Name: 'Location name must be less than 30 characters' });
      return;
    }
    if (isNaN(Price)) {
      setErrors({ ...errors, Price: 'Price must be a number' });
      return;
    }
    if (isNaN(Price_WT)) {
      setErrors({ ...errors, Price_WT: 'Price WT must be a number' });
      return;
    }

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

    // Validate inputs during editing
    if (name === 'Location_Name' && value.length > 30) {
      setErrors({ ...errors, [name]: 'Location name must be less than 30 characters' });
    } else if ((name === 'Price' || name === 'Price_WT') && isNaN(value)) {
      setErrors({ ...errors, [name]: 'Price must be a number' });
    } else {
      setErrors({ ...errors, [name]: '' });
    }

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
    
    // Final validation check before saving
    if (isNaN(Price) || isNaN(Price_WT)) {
      setErrors({ ...errors, Price: 'Prices must be numeric' });
      return;
    }

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
        <div style={{ flexGrow: 1 }}>
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
                            error={!!errors.Price}
                            helperText={errors.Price}
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
                            error={!!errors.Price_WT}
                            helperText={errors.Price_WT}
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
                error={!!errors.Location_Name}
                helperText={errors.Location_Name}
              />
              <TextField
                label="Price"
                name="Price"
                value={newLocation.Price}
                onChange={handleInputChange}
                required
                error={!!errors.Price}
                helperText={errors.Price}
              />
              <TextField
                label="Price WT"
                name="Price_WT"
                value={newLocation.Price_WT}
                onChange={handleInputChange}
                required
                error={!!errors.Price_WT}
                helperText={errors.Price_WT}
              />
              <Button type="submit" variant="contained" color="primary">
                Add Location
              </Button>
            </form>
          </Container>
        </div>
      </div>
    </div>
  );
}

export default App;
