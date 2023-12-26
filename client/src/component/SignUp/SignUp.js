import React, { useState } from 'react';
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBRow, MDBCol, MDBInput } from 'mdbreact';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from 'react-router-dom';  // Import useHistory

function SignUp() {
  const [patientInfo, setPatientInfo] = useState({
    patient_id: '',
    full_name: '',
    dob: '',
    gender: '',
    phone_number: '',
    address: '',
    email: '',
    password: '',
    // confirmPassword: ''
  });

  const history = useHistory();  // Create a history object

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('/patient/add_patient', patientInfo);
      if (response.data && response.data.success) {
        console.log('Patient added successfully!');
        toast.success('Registration successful!', { position: 'top-right' });
        history.push('/login');
      } else {
        console.error('Failed to add patient:', response.data ? response.data.error : 'Unknown error');
        toast.error('Failed to register patient. Please try again.', { position: 'top-right' });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again later.', { position: 'top-right' });
    }
  };
  


  return (
    <MDBContainer fluid className='bg-dark'>
      <MDBRow className='d-flex justify-content-center align-items-center h-100'>
        <MDBCol>
          <MDBCard className='my-4'>
            <MDBCardBody className='text-black d-flex flex-column justify-content-center'>
              <h3 className="mb-5 text-uppercase fw-bold">Patient Registration Form</h3>
              <form onSubmit={handleSubmit}>
                <MDBRow>
                  <MDBCol md='6'>
                    <MDBInput
                      label='Patient ID'
                      group
                      size='lg'
                      id='patient_id'
                      type='text'
                      name='patient_id'
                      value={patientInfo.patient_id}
                      onChange={handleChange}
                    />
                  </MDBCol>

                  <MDBCol md='6'>
                    <MDBInput
                      label='Full Name'
                      group
                      size='lg'
                      id='full_name'
                      type='text'
                      name='full_name'
                      value={patientInfo.full_name}
                      onChange={handleChange}
                    />
                  </MDBCol>
                  <MDBCol md='6'>
                    <MDBInput
                      label='Date of Birth'
                      group
                      size='lg'
                      id='dob'
                      type='date'
                      name='dob'
                      value={patientInfo.dob}
                      onChange={handleChange}
                    />
                  </MDBCol>
                </MDBRow>
                <MDBInput
                  label='Gender'
                  group
                  size='lg'
                  id='gender'
                  type='text'
                  name='gender'
                  value={patientInfo.gender}
                  onChange={handleChange}
                />
                <MDBInput
                  label='Phone Number'
                  group
                  size='lg'
                  id='phone_number'
                  type='text'
                  name='phone_number'
                  value={patientInfo.phone_number}
                  onChange={handleChange}
                />
                <MDBInput
                  label='Address'
                  group
                  size='lg'
                  id='address'
                  type='text'
                  name='address'
                  value={patientInfo.address}
                  onChange={handleChange}
                />
                <MDBInput
                  label='Email ID'
                  group
                  size='lg'
                  id='email'
                  type='email'
                  name='email'
                  value={patientInfo.email}
                  onChange={handleChange}
                />
                <MDBInput
                  label='Password'
                  group
                  size='lg'
                  id='password'
                  type='password'
                  name='password'
                  value={patientInfo.password}
                  onChange={handleChange}
                />
                <div className="d-flex justify-content-end pt-3">
                  <MDBBtn color='light' size='lg' type='reset'>
                    Reset all
                  </MDBBtn>
                  <MDBBtn className='ms-2' color='warning' size='lg' type='submit'>
                    Submit form
                  </MDBBtn>
                </div>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
      {/* Add ToastContainer at the end of the component */}
      <ToastContainer />
    </MDBContainer>
  );
}

export default SignUp;
