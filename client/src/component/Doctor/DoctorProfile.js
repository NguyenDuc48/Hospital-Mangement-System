import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardImage,
  MDBCardBody,
  MDBCardText,
  MDBTypography,
  MDBIcon,
  MDBBtn,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
  MDBModal,
  MDBInput,
} from 'mdbreact';
import Header from './Header';
import DoctorSidebar from './DoctorSidebar'; // Create DoctorSidebar component for doctor-specific content
import jwt from 'jsonwebtoken';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DoctorProfile = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editedData, setEditedData] = useState({
    old_password: '',
    new_password: '',
    retype_password: ''
  });
  const [isValidAccess, setValidAccess] = useState(false);
  useEffect(() => {
    const decodeToken = () => {  
        const token = localStorage.getItem('token');
        if (!token) {
          setValidAccess(false)
        }
        else {
          const decoded = jwt.decode(token);
          console.log("decode day nay:", decoded)
          if (decoded.userId.substring(0,2) === "BS") 
            setValidAccess(true);
          else setValidAccess(false)
        }
    };
    decodeToken();
  },[]);
  const fetchDoctorProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      const response = await axios.get('/doctor/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.data) {
        throw new Error('Empty response data');
      }

      setDoctorData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctor profile:', error.message);
      setError('Failed to fetch doctor profile');
      setLoading(false);
    }
  };

  const openModal = () => {
    setModalOpen(true);
    // Set initial data for editing
    setEditedData({
      full_name: doctorData[0].full_name,
      dob: new Date(doctorData[0].dob).toLocaleDateString(),
      gender: doctorData[0].gender,
      phone_number: doctorData[0].phone_number,
      address: doctorData[0].address,
      email: doctorData[0].email,
      expertise: doctorData[0].expertise,
      department: doctorData[0].department,
      salary: doctorData[0].salary,
      work_from: new Date(doctorData[0].work_from).toLocaleDateString(),
      status: doctorData[0].status,
    });
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const saveChanges = async () => {

    console.log('Saving changes:', editedData);
    if (editedData.retype_pass !== editedData.new_pass) {
      toast.error('Passwords do not match', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    else {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found in localStorage');
        }
  
        console.log("editeddata nè:", editedData)
        await axios.put('/doctor/update_profile', editedData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        toast.success('Changed password successfully!', {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
  
        closeModal();
        fetchDoctorProfile();
  
      } catch (error) {
        console.error('Error updating nurse profile:', error.message);
        closeModal();
        fetchDoctorProfile();
        toast.error('Password change failed', {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
    
  };
  useEffect(() => {
    fetchDoctorProfile();
  }, []);
  if (isValidAccess)

  return (
    <div>
      <Header />
      <ToastContainer position="bottom-right" autoClose={2000} />
      <div
        style={{
          display: 'flex',
          overflowY: 'auto',
          width: '100%',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ width: '25%' }}>
          <DoctorSidebar />
        </div>
        <div
          style={{
            height: '100vh',
            overflow: 'scroll initiali',
            width: '70%',
          }}
        >
          <MDBContainer className="py-5">
            <MDBRow className="justify-content-center align-items-center">
              <MDBCol lg="20" className="mb-4 mb-lg-0">
                {doctorData && (
                  <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
                    <MDBRow className="g-0">
                      <MDBCol
                        md="4"
                        className="gradient-custom text-center text-white"
                        style={{
                          borderTopLeftRadius: '.5rem',
                          borderBottomLeftRadius: '.5rem',
                          backgroundColor: '#F9BE72',
                        }}
                      >
                        <MDBCardImage
                          src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                          alt="Avatar"
                          className="my-5"
                          style={{ width: '80px' }}
                          fluid
                        />
                        <MDBTypography tag="h5">{doctorData[0].full_name}</MDBTypography>
                        <MDBCardText>Doctor</MDBCardText>
                        <MDBIcon far icon="edit mb-5" onClick={openModal} />
                      </MDBCol>
                      <MDBCol md="8">
                        <MDBCardBody className="p-4">
                          <MDBTypography style={{ fontWeight: 'bold' }} tag="h4">
                            INFORMATION
                          </MDBTypography>
                          <hr style={{ borderTop: '2px solid black' }} className="mt-0 mb-4" />
                          <MDBRow className="pt-1">
                            <MDBCol size="6" className="mb-3">
                              <MDBTypography tag="h6" style={{ fontWeight: 'bold' }}>
                                ID
                              </MDBTypography>
                              <MDBCardText className="text-muted">{doctorData[0].doctor_id}</MDBCardText>
                            </MDBCol>
                            <MDBCol size="6" className="mb-3">
                              <MDBTypography tag="h6" style={{ fontWeight: 'bold' }}>
                                Full Name
                              </MDBTypography>
                              <MDBCardText className="text-muted">{doctorData[0].full_name}</MDBCardText>
                            </MDBCol>

                            <MDBCol size="6" className="mb-3">
                              <MDBTypography style={{ fontWeight: 'bold' }} tag="h6">
                                Email
                              </MDBTypography>
                              <MDBCardText className="text-muted">{doctorData[0].email}</MDBCardText>
                            </MDBCol>
                            <MDBCol size="6" className="mb-3">
                              <MDBTypography style={{ fontWeight: 'bold' }} tag="h6">
                                Phone
                              </MDBTypography>
                              <MDBCardText className="text-muted">{doctorData[0].phone_number}</MDBCardText>
                            </MDBCol>
                            <MDBCol size="6" className="mb-3">
                              <MDBTypography style={{ fontWeight: 'bold' }} tag="h6">
                                Address
                              </MDBTypography>
                              <MDBCardText className="text-muted">{doctorData[0].address}</MDBCardText>
                            </MDBCol>
                            <MDBCol size="6" className="mb-3">
                              <MDBTypography style={{ fontWeight: 'bold' }} tag="h6">
                                Date of Birth
                              </MDBTypography>
                              <MDBCardText className="text-muted">
                                {new Date(doctorData[0].dob).toLocaleDateString()}
                              </MDBCardText>
                            </MDBCol>
                            <MDBCol size="6" className="mb-3">
                              <MDBTypography style={{ fontWeight: 'bold' }} tag="h6">
                                Expertise
                              </MDBTypography>
                              <MDBCardText className="text-muted">{doctorData[0].expertise}</MDBCardText>
                            </MDBCol>
                            <MDBCol size="6" className="mb-3">
                              <MDBTypography style={{ fontWeight: 'bold' }} tag="h6">
                                Department
                              </MDBTypography>
                              <MDBCardText className="text-muted">{doctorData[0].department}</MDBCardText>
                            </MDBCol>
                            <MDBCol size="6" className="mb-3">
                              <MDBTypography style={{ fontWeight: 'bold' }} tag="h6">
                                Salary
                              </MDBTypography>
                              <MDBCardText className="text-muted">{doctorData[0].salary}</MDBCardText>
                            </MDBCol>
                            <MDBCol size="6" className="mb-3">
                              <MDBTypography style={{ fontWeight: 'bold' }} tag="h6">
                                Work From
                              </MDBTypography>
                              <MDBCardText className="text-muted">
                                {new Date(doctorData[0].work_from).toLocaleDateString()}
                              </MDBCardText>
                            </MDBCol>
                            <MDBCol size="6" className="mb-3">
                              <MDBTypography style={{ fontWeight: 'bold' }} tag="h6">
                                Status
                              </MDBTypography>
                              <MDBCardText className="text-muted">{doctorData[0].status}</MDBCardText>
                            </MDBCol>
                          </MDBRow>
                          <div className="d-flex justify-content-start">
                            {/* Add social media icons or links here */}
                          </div>
                        </MDBCardBody>
                      </MDBCol>
                    </MDBRow>
                  </MDBCard>
                )}
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
              </MDBCol>
            </MDBRow>
          </MDBContainer>

          <MDBModal isOpen={isModalOpen} toggle={closeModal}>
            <MDBModalHeader toggle={closeModal} className="bg-primary text-white">
              Edit Doctor Information
            </MDBModalHeader>
            <MDBModalBody>
              {/* Use MDBInput for enhanced styling */}
              {/* <MDBInput label="Full Name" type="text" id="full_name" name="full_name" value={editedData.full_name} onChange={handleInputChange} />
              <MDBInput label="Date of Birth" type="date" id="dob" name="dob" value={editedData.dob} onChange={handleInputChange} />
              <MDBInput label="Gender" type="text" id="gender" name="gender" value={editedData.gender} onChange={handleInputChange} />
              <MDBInput label="Phone Number" type="text" id="phone_number" name="phone_number" value={editedData.phone_number} onChange={handleInputChange} />
              <MDBInput label="Address" type="text" id="address" name="address" value={editedData.address} onChange={handleInputChange} />
              <MDBInput label="Email" type="text" id="email" name="email" value={editedData.email} onChange={handleInputChange} /> */}
              {/* <MDBInput label="Expertise" type="text" id="expertise" name="expertise" value={editedData.expertise} onChange={handleInputChange} /> */}
              {/* <MDBInput label="Department" type="text" id="department" name="department" value={editedData.department} onChange={handleInputChange} /> */}
              {/* <MDBInput label="Salary" type="text" id="salary" name="salary" value={editedData.salary} onChange={handleInputChange} /> */}
              {/* <MDBInput label="Work From" type="date" id="work_from" name="work_from" value={editedData.work_from} onChange={handleInputChange} /> */}
              {/* <MDBInput label="Status" type="text" id="status" name="status" value={editedData.status} onChange={handleInputChange} /> */}
              <MDBInput label="Old password" type="password" id="old_pass" name="old_pass" value={editedData.old_password} onChange={handleInputChange} />


<MDBInput label="New password" type="password" id="new_pass" name="new_pass" value={editedData.new_password} onChange={handleInputChange} />


<MDBInput label="Retype password" type="password" id="retype_pass" name="retype_pass" value={editedData.retype_password} onChange={handleInputChange} />
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={closeModal}>
                Cancel
              </MDBBtn>
              <MDBBtn color="primary" onClick={saveChanges}>
                Save
              </MDBBtn>
            </MDBModalFooter>
          </MDBModal>
        </div>
      </div>
    </div>
  );
  else
  return (      
  <p
    style={{
      color: 'red',
      fontWeight: 'bold',
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
      padding: '10px',
      backgroundColor: '#ffe6e6',
      borderRadius: '5px',
    }}
  >
    Access Denied
  </p>);
};

export default DoctorProfile;
