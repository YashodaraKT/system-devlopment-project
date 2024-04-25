import React from 'react';
import { Button, Accordion, } from 'react-bootstrap';
import '../css/Login.css'; 
import backgroundImage from '../assets/login.jpg';

export default function Signup() {
  return (
    <div>
      <div className='logsignup-container' style={{backgroundImage: `url(${backgroundImage})`}}>
      <div className='logsignup-form'>
        
      <form>
          <h1>SignUp</h1>
          <div className='logsignup-input'>
        <label htmlFor='usertype'>User Type</label>
        <input type='text' placeholder='Enter User type' className='form-control rounded-1' />
        </div>

        <div className='logsignup-input'>
        <label htmlFor='username'>Username</label>
        <input type='text'placeholder='Enter username'className='form-control rounded-1'/>
        </div>

        <div className='logsignup-input'>
        <label htmlFor='Mobile Number'>Mobile Number</label>
        <input type='text'placeholder='Enter Mobile Number'className='form-control rounded-1'/>
        </div>

        <div className='logsignup-input'>
        <label htmlFor='password'>Enter password</label>
        <input type='password'placeholder='Enter Password'className='form-control rounded-1'/>
        </div>

        <div className='logsignup-input'>
        <label htmlFor='password'>confirm password</label>
        <input type='text'placeholder='confirm password'className='form-control rounded-1'/>
        </div>
        
        <div className='form-check'>
          <input type="checkbox" className="form-check-input" id="termsCheckbox"/>
          <label className="form-check-label" htmlFor="termsCheckbox">
             I agree to terms and conditions
          </label>
        </div>
        <Button variant="danger" className='logsignup-button w-100'>Create Account</Button>{' '}
       
        
      </form>
      </div>
      </div>
      </div>
    
  );
}
