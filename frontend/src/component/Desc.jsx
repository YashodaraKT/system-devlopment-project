import React from 'react';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import image1 from '../assets/image1.jpg';
import image2 from '../assets/image2.jpg';
import image3 from '../assets/image3.jpg';
import image4 from '../assets/image4.jpg';
import image5 from '../assets/image5.jpg';
import image6 from '../assets/image6.jpg';
import image7 from '../assets/image7.jpg';
import image8 from '../assets/image8.jpg';


function Desc() {
  return (
    <>
      {[
        'Light',
      ].map((variant) => (
        <div key={variant} className="d-flex">
            
          <Card
            bg={variant.toLowerCase()}
            text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
          
            className="mb-2 mr-2"
            style={{ height: '550px',Width: 'auto',flex: '1',margin: '30px' }}
          >
            
            <Card.Body style={{textAlign: 'justify' }}>
              
              <Card.Text style={{fontSize: '1.2rem'}}>
              Welcome to Moro Farms! <br/>
              At Moro Farm, we're not just about farming – we're about fostering a sustainable ecosystem that benefits both our environment and our community. Nestled in the heart of Horana, Sri Lanka, we specialize in producing top-notch fishmeal sourced from the abundance of our oceans.
             <br/><br/>
             Our journey begins at Beruwala Pier and extends to the bustling markets of Kalutara, Panadura, and beyond, where we diligently gather bycatch and surplus fish. With our fleet of two trucks, we ensure timely collection, or our suppliers have the option to deliver directly to our doorstep,
              where fair compensation awaits their efforts. Once in our hands, the fish undergo a meticulous transformation. We clean, dry, and crush them with care, turning them into nutrient-rich fishmeal. This valuable product isn't just any feed – it's a vital supplement for farms housing pigs and chickens, 
              enriching their diet and ensuring their well-being.
              </Card.Text>
            </Card.Body>
          </Card>
          <Accordion defaultActiveKey="0" style={{ flex: '1',margin:'30px' }}>
            <Accordion.Item eventKey="0">
              <Accordion.Header>If you are a supplier,</Accordion.Header>
              <Accordion.Body style={{ textAlign: 'justify' }}>
                <ul style={{ listStyleType: 'none' }}>
              <li> <img src={image1} alt="Image 1" style={{ width: '125px', height: '125px' }}/>
              View own payments.</li>
              <li><img src={image2} alt="Image 2" style={{ width: '125px', height: '125px' }}/>
                Check payment status (payable/paid).</li>
              <li><img src={image3} alt="Image 3" style={{ width: '125px', height: '125px' }}/>
                Ability to submit requests for transport.</li>
              </ul>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>If you are a customer,</Accordion.Header>
              <Accordion.Body style={{ textAlign: 'justify' }}>
              <ul style={{ listStyleType: 'none' }}>
                <li> <img src={image4} alt="Image 4" style={{ width: '125px', height: '125px' }}/>
                  Modify scheduled orders at the beginning of month.</li>
                <li><img src={image5} alt="Image 5" style={{ width: '125px', height: '125px' }}/>
                  Have the option to place additional orders.</li>
                <li><img src={image6} alt="Image 6" style={{ width: '125px', height: '125px' }}/>
                  View current month payments.</li>
                <li><img src={image7} alt="Image 7" style={{ width: '125px', height: '125px' }}/>
                  Review payment history and search by date range.</li>
                <li><img src={image8} alt="Image 8" style={{ width: '125px', height: '125px' }}/>
                  Receive reminders for pending payments before 5 days.</li>
              </ul>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      ))}
    </>
  );
}

export default Desc;
