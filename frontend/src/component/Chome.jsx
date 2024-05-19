import Carousel from 'react-bootstrap/Carousel';
import React from 'react';
import h1Image from '../assets/h1.png';
import h2Image from '../assets/h2.jpg';


function Chome() {
  return (
    <div>
      <div className='custom-container'>
        <Carousel fade>
        <Carousel.Item>
  <img
    className="d-block w-100"
    src={h1Image}
    alt="Second slide"
    style={{
      maxHeight: '500px', // Adjust this value as needed
      objectFit: 'contain', // Changed 'cover' to 'contain'
      backgroundPosition: 'fixed'
    }}
  />
</Carousel.Item>

<Carousel.Item>
  <img
    className="d-block w-100"
    src={h2Image}
    alt="First slide"
    style={{
      maxHeight: '500px', // Adjust this value as needed
      objectFit: 'contain', // Changed 'cover' to 'contain'
      backgroundPosition: 'fixed'
    }}
  />
  <Carousel.Caption style={{color:"black"}}>
    <h3>Moro Farms</h3>
    <p>Feeding Farms, Preserving Seas.</p>
  </Carousel.Caption>
</Carousel.Item>


          
        </Carousel>
      </div>
    </div>
  );
}

export default Chome;
