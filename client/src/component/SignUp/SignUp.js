import React, { useState } from 'react';
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBRow, MDBCol, MDBInput } from 'mdbreact';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from 'react-router-dom';  // Import useHistory
import './SignUp.css';
function SignUp() {

  const initialPatientInfo = {
    full_name: '',
    dob: '',
    gender: '',
    phone_number: '',
    address: '',
    email: '',
    password: '',
  };

  const [patientInfo, setPatientInfo] = useState(initialPatientInfo);

  const history = useHistory();  // Create a history object

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value
    }));
  };

  const handleReset = () => {
    setPatientInfo(initialPatientInfo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/patient/add_patient', patientInfo);

      console.log('Server Response:', response);

      if (response.data && response.data.success) {
        console.log('Patient added successfully!');
        toast.success('Đăng kí thành công, hãy đăng nhập lại', { position: 'top-right' });
        setTimeout(() => {
          history.push('/login');
        }, 3000);
      } 
      // else {
      //   // Check for HTTP 400 status code
      //   if (response.status === 400) {
      //     console.log('Username already exists.');
      //     toast.error('Số điện thoại đã được sử dụng, hãy chọn số điện thoại khác.', { position: 'top-right' });
      //   } else {
      //     console.error('Failed to add patient:', response.data ? response.data.error : 'Unknown error');
      //     toast.error('Xảy ra lỗi khi đăng kí, hãy thử lại sau', { position: 'top-right' });
      //   }
      // }
    } catch (error) {
      console.error('Error in catch block:', error);

      if (error.response) {
        // The request was made and the server responded with a non-2xx status code
        console.error('Server responded with a non-success status code:', error.response.status);

        if (error.response.status === 400) {
          console.log('Username already exists.');
          toast.error('Số điện thoại đã được sử dụng, hãy chọn số điện thoại khác.', { position: 'top-right' });
        } else {
          console.error('Failed to add patient:', error.response.data ? error.response.data.error : 'Unknown error');
          toast.error('Xảy ra lỗi khi đăng kí, hãy thử lại sau.', { position: 'top-right' });
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received from the server.');
        toast.error('Không có phản hồi từ server, hãy thử lại sau.', { position: 'top-right' });
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up the request:', error.message);
        toast.error('Đã xảy ra lỗi, hãy thử lại sau.', { position: 'top-right' });
      }
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
                      label='Họ tên'
                      group
                      size='lg'
                      id='full_name'
                      type='text'
                      name='full_name'
                      value={patientInfo.full_name}
                      onChange={handleChange}
                      placeholder='Enter your full name'
                    />
                  </MDBCol>
                  <MDBCol md='6'>
                    <MDBInput
                      label='Ngày sinh'
                      group
                      size='lg'
                      id='dob'
                      type='date'
                      name='dob'
                      value={patientInfo.dob}
                      onChange={handleChange}
                      placeholder='Enter your date of birth'
                    />
                  </MDBCol>
                </MDBRow>
                <MDBInput
                  label='Giới tính'
                  group
                  size='lg'
                  id='gender'
                  type='text'
                  name='gender'
                  value={patientInfo.gender}
                  onChange={handleChange}
                />
                <MDBInput
                  label='Số điện thoại ( dùng làm tên đăng nhập )'
                  group
                  size='lg'
                  id='phone_number'
                  type='text'
                  name='phone_number'
                  value={patientInfo.phone_number}
                  onChange={handleChange}
                />
                <MDBInput
                  label='Địa chỉ'
                  group
                  size='lg'
                  id='address'
                  type='text'
                  name='address'
                  value={patientInfo.address}
                  onChange={handleChange}
                />
                <MDBInput
                  label='Email'
                  group
                  size='lg'
                  id='email'
                  type='email'
                  name='email'
                  value={patientInfo.email}
                  onChange={handleChange}
                />
                <MDBInput
                  label='Mật khẩu'
                  group
                  size='lg'
                  id='password'
                  type='password'
                  name='password'
                  value={patientInfo.password}
                  onChange={handleChange}
                />
                <div className="d-flex justify-content-end pt-3">
                  <MDBBtn color='light' size='lg' type='button' onClick={handleReset}>
                    Xóa tất cả
                  </MDBBtn>
                  <MDBBtn className='ms-2' color='warning' size='lg' type='submit'>
                    Đăng kí
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
