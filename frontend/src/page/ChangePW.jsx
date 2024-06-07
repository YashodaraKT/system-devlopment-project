import React, { useState } from 'react';
import { Button, Container, Grid, TextField, Card, CardContent } from '@mui/material';
import axios from 'axios';
import '../css/ChangePW.css';
import Footer from '../component/Footer';

const ChangePW = () => {
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');

  const resetForm = () => {
    setUsername('');
    setCurrentPassword('');
    setNewPassword('');
    setStatus('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:8081/change-password', {
        username,
        currentPassword,
        newPassword,
      });
  
      setStatus(response.data.status);
  
      if (response.data.status === 'Password changed successfully') {
        resetForm(); // Clear input fields
      }
    } catch (error) {
      console.error(error);
      setStatus('Error changing password');
    }
  };
  
  return (
    <div>
      <Container className="mt-5">
        <Grid container justifyContent="center" alignItems="center">
          <Grid item md={6} className="text-center">
            <img src={require('../assets/cpw.jpg')} alt="Background" className="img-fluid" />
          </Grid>
          <Grid item md={6}>
            <div className="custom-form-container">
              <Card sx={{ width: '100%' }}>
                <CardContent className="card-content">
                  <h2 className="mb-4">Change Password</h2>
                  <form onSubmit={handleSubmit}>
                    <TextField
                      id="username"
                      label="Username"
                      variant="outlined"
                      fullWidth
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      id="currentPassword"
                      label="Current Password"
                      type="password"
                      variant="outlined"
                      fullWidth
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      id="newPassword"
                      label="New Password"
                      type="password"
                      variant="outlined"
                      fullWidth
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <Button variant="contained" type="submit" fullWidth>
                      Change Password
                    </Button>
                  </form>
                  {status && <p className="mt-3">{status}</p>}
                </CardContent>
              </Card>
            </div>
          </Grid>
        </Grid>
      </Container>

      <br />
      <br />
      <div><Footer /></div>
    </div>
  );
};

export default ChangePW;
