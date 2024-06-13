import React from 'react';
import { Phone, Mail, Room } from '@mui/icons-material';
import backgroundImage from '../assets/footer.jpg';

const footerStyle = {
  position: 'relative', // Make the footer a relative position container
  color: '#fff',
  padding: '20px 0',
  textAlign: 'center',
  backgroundImage: `url(${backgroundImage})`, // Use backticks for template literals to correctly include backgroundImage
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
};

const overlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the transparency here (0.5 is 50% opacity)
  zIndex: 1,
};

const containerStyle = {
  position: 'relative', // Ensure the container content is above the overlay
  zIndex: 2,
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  flexWrap: 'wrap',
  maxWidth: '1200px',
  margin: '0 auto',
};

const cardStyle = {
  backgroundColor: 'rgba(68, 68, 68, 0.8)', // Make the background of the cards slightly transparent
  padding: '15px',
  borderRadius: '5px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  margin: '10px',
  flex: '1',
  minWidth: '250px',
};

const iconStyle = {
  marginRight: '10px',
  verticalAlign: 'middle',
};

const infoStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '10px',
};

const textStyle = {
  margin: 0,
  textAlign: 'left', // Align text to the left
};

const copyrightStyle = {
  marginTop: '20px',
  borderTop: '1px solid #444',
  paddingTop: '10px',
  fontSize: '14px',
};

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <div style={overlayStyle}></div>
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h4>Omega</h4>
          <div style={infoStyle}>
            <p style={textStyle}>Harvesting the bounty of the sea
            to nourish our fields and flocks! 🌊🌾 Every bite bridges the gap between land and ocean, a sustainable circle of life.</p>
           
          </div>
        </div>
       
        <div style={cardStyle}>
          <div style={infoStyle}>
            <Phone style={iconStyle} />
            <p style={textStyle}>+94 (71) 226 8551</p>
          </div>
          <div style={infoStyle}>
            <Mail style={iconStyle} />
            <p style={textStyle}>info@morofarms.com</p>
          </div>
          <div style={infoStyle}>
            <Room style={iconStyle} />
            <p style={textStyle}>Moro Farms, Yala, Ballapitiya, Aguruwathota</p>
          </div>
        </div>
      </div>
      <div style={copyrightStyle}>
        &copy; Copyright 2024 MORO Farms(Pvt) Ltd. All Rights Reserved.
        <br />
        
      </div>
    </footer>
  );
};

export default Footer;
