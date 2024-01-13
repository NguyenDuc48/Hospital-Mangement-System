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
  MDBInput

} from 'mdbreact';
import Header from './Header';
import PatientSidebar from './PatientSidebar';
import jwt from 'jsonwebtoken';

const PatientProfile = () => {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editedData, setEditedData] = useState({
    full_name: '',
    dob: '',
    gender: '',
    phone_number: '',
    address: '',
    email: '',
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
          if (decoded.userId.substring(0,2) === "BN") 
            setValidAccess(true);
          else setValidAccess(false)
        }
    };
    decodeToken();
  },[]);

  const fetchPatientProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }
  
      const response = await axios.get('/patient/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.data) {
        throw new Error('Empty response data');
      }
  
      setPatientData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching patient profile:', error.message);
      setError('Failed to fetch patient profile');
      setLoading(false);
    }
  };
  
  const openModal = () => {
    setModalOpen(true);
    // Set initial data for editing
    setEditedData({
      full_name: patientData[0].full_name,
      dob: new Date(patientData[0].dob).toLocaleDateString(),
      gender: patientData[0].gender,
      phone_number: patientData[0].phone_number,
      address: patientData[0].address,
      email: patientData[0].email,
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
    // Add logic to send edited data to the server and update the profile
    // You can use axios.put or axios.post here
    console.log('Saving changes:', editedData);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }
  
      await axios.put('/patient/update_profile', editedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      // Close the modal and fetch updated patient profile
      closeModal();
      fetchPatientProfile();
    } catch (error) {
      console.error('Error updating patient profile:', error.message);
      // Handle error updating profile
    }
  };
      
  useEffect(() => {
  fetchPatientProfile();
}, []);




  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found in localStorage');
        }

        const response = await axios.get('/patient/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.data) {
          throw new Error('Empty response data');
        }

        setPatientData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching patient profile:', error.message);
        setError('Failed to fetch patient profile');
        setLoading(false);
      }
    };

    fetchPatientProfile();
  }, []); 
  console.log('Rendering component with patientData:', patientData);

  if (isValidAccess)

  return (
    <div>
      <Header />
      <div
        style={{
          display: 'flex',
          overflowY: 'auto',
          width: '100%',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ width: '25%' }}>
          <PatientSidebar />
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
                {patientData && (
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
                        <MDBTypography tag="h5">
                          {patientData[0].full_name}
                        </MDBTypography>
                        <MDBCardText>Patient</MDBCardText>
                        {/* <MDBIcon far icon="edit mb-5" /> */}
                        <MDBIcon far icon="edit mb-5" onClick={openModal} />

                      </MDBCol>
                      <MDBCol md="8">
                        <MDBCardBody className="p-4">
                          <MDBTypography style={{fontWeight: "bold"}}  tag="h4">INFORMATION</MDBTypography>
                          <hr style={{borderTop:"2px solid black"}} className="mt-0 mb-4" />
                          <MDBRow className="pt-1">
                          <MDBCol size="6" className="mb-3">
                              <MDBTypography tag="h6" style={{fontWeight: "bold"}}>ID</MDBTypography>
                              <MDBCardText className="text-muted">
                                {patientData[0].patient_id}
                              </MDBCardText>
                            </MDBCol>
                            <MDBCol size="6"  className="mb-3">
                              <MDBTypography tag="h6" style={{fontWeight: "bold"}}>Full Name</MDBTypography>
                              <MDBCardText className="text-muted">
                                {patientData[0].full_name}
                              </MDBCardText>
                            </MDBCol>


                            <MDBCol size="6"  className="mb-3">
                              <MDBTypography style={{fontWeight: "bold"}} tag="h6">Email</MDBTypography>
                              <MDBCardText className="text-muted">
                                {patientData[0].email}
                              </MDBCardText>
                            </MDBCol>
                            <MDBCol size="6" className="mb-3">
                              <MDBTypography style={{fontWeight: "bold"}} tag="h6">Phone</MDBTypography>
                              <MDBCardText className="text-muted">
                                {patientData[0].phone_number}
                              </MDBCardText>
                            </MDBCol>
                            <MDBCol size="6" className="mb-3">
                              <MDBTypography style={{fontWeight: "bold"}} tag="h6">Address</MDBTypography>
                              <MDBCardText className="text-muted">
                                {patientData[0].address}
                              </MDBCardText>
                            </MDBCol>
                            <MDBCol size="6" className="mb-3">
                              <MDBTypography  style={{fontWeight: "bold"}} tag="h6">Date of Birth</MDBTypography>
                              <MDBCardText className="text-muted">
                                {new Date(patientData[0].dob).toLocaleDateString()}
                              </MDBCardText>
                            </MDBCol>
                            <MDBCol size="6" className="mb-3">
                              <MDBTypography style={{fontWeight: "bold"}} tag="h6">Health Insurance Percent</MDBTypography>
                              <MDBCardText className="text-muted">
                                {patientData[0].health_insurance_percent}
                              </MDBCardText>
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
          <MDBModalHeader toggle={closeModal}>Edit Patient Information</MDBModalHeader>
          <MDBModalBody>
          {/* Use MDBInput for enhanced styling */}
          <MDBInput label="Full Name" type="text" id="full_name" name="full_name" value={editedData.full_name} onChange={handleInputChange} />

          <MDBInput label="Date of Birth" type="date" id="dob" name="dob" value={editedData.dob} onChange={handleInputChange} />

          <MDBInput label="Gender" type="text" id="gender" name="gender" value={editedData.gender} onChange={handleInputChange} />

          <MDBInput label="Phone Number" type="text" id="phone_number" name="phone_number" value={editedData.phone_number} onChange={handleInputChange} />

          <MDBInput label="Address" type="text" id="address" name="address" value={editedData.address} onChange={handleInputChange} />

          <MDBInput label="Email" type="text" id="email" name="email" value={editedData.email} onChange={handleInputChange} />
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

export default PatientProfile;
