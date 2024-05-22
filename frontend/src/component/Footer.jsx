import React from 'react';
import Card from 'react-bootstrap/Card';
import { FaMobileAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'; // Import the required icons

function Footer() {
  return (
    <div>
      <Card>
        <Card.Footer style={{ backgroundColor: 'black', color: 'white', display: 'flex', justifyContent: 'space-between', padding: '20px' }} className="text-muted">
          <div style={{ color: 'white' }}>
            <br/>
            <span style={{  fontSize: '1.2rem' }}>Harvesting the bounty of the sea </span>
            <br />
            <span style={{  fontSize: '1.2rem' }}> to nourish our fields and flocks! 🌊🌾</span>
            <br />
            <br />
            <span style={{ fontSize: '1rem' }}>Every bite bridges the gap between land and ocean, a sustainable circle of life.</span>
          </div>
          <div style={{ marginRight: '20px', color: 'white' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.8rem' }}>Contact Us</span>
            <br /><br/>
            <FaMobileAlt style={{ marginRight: '5px' }} /> <span style={{ fontSize: '1rem' }}>0777617031</span>
            <br />
            <FaEnvelope style={{ marginRight: '5px' }} /> <span style={{ fontSize: '1rem' }}>morofarms12@gmail.com</span>
            <br />
            <FaMapMarkerAlt style={{ marginRight: '5px' }} /> <span style={{ fontSize: '1rem' }}>Moro Farms, Yala, Ballapitiya, Aguruwathota</span>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default Footer;
