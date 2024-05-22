import React from 'react';
import Chome from '../component/Chome';
import Hnbar from '../component/Hnbar';
import Desc from '../component/Desc';
import Footer from '../component/Footer';


function Home() {
  return (
    <>
      <div>
       
        <div><Hnbar /></div>
        <br />
        <div><Chome /></div>
        <br />
        <br />
        <div style={{ textAlign: 'left', marginLeft: '30px' }}>
          <h5 style={{ margin: '0', padding: '0' }}>Moro Farms</h5>
          <h1 style={{ marginTop: '0', marginBottom: '0.25rem' }}>who we are</h1>
        </div>
        <div><Desc /></div>
        <br />
        <br />
        <div><Footer /></div>
      </div>
    </>
  );
}

export default Home;
