import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import NImage from '../assets/nn.jpg'; // Ensure this path is correct

function Hnbar() {
  const navbarStyle = {
    backgroundColor: '#CCCCCC',
    fontSize: '15px',
    color: 'white',
  };

  const navLinkStyle = {
    color: 'black',
    fontSize: '16px',
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    textDecoration: 'none',
    margin: '0 10px'
  };

  return (
    <div>
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <img src={NImage} alt="Your Image" style={{ height: '125px', width: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: '0', right: '0', padding: '10px', display: 'flex', alignItems: 'center' }}>
          <IconButton aria-label="search" style={{ color: 'white' }}>
            <SearchIcon />
          </IconButton>
          <TextField
            placeholder="Search..."
            variant="outlined"
            size="small"
            style={{ backgroundColor: 'white', borderRadius: '5px', marginLeft: '5px' }}
          />
        </div>
      </div>
      <AppBar position="static" style={navbarStyle}>
        <Toolbar>
          <Typography variant="h6" component="div">
            Omega
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <Button href="/" style={navLinkStyle}>Home</Button>
            <Button href="/productcart" style={navLinkStyle}>Our Products</Button>
          </Box>
          <Button href="/login" style={navLinkStyle}>Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Hnbar;
