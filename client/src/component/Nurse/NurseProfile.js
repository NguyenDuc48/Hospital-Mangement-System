import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBTypography,
  MDBIcon,
  MDBBtn,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
  MDBModal,
  MDBInput,MDBCardImage
} from 'mdbreact';
import Header from './Header';
import NurseSidebar from './NurseSidebar';

const NurseProfile = () => {
  const [nurseData, setNurseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editedData, setEditedData] = useState({
    full_name: '',
    dob: '',
    gender: '',
    phone_number: '',
    email: '',
    address: '',
    department: '',
    shift: '',
    employee_id: '',
    salary: '',
    work_from: '',
    status: '',
  });

  const fetchNurseProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      const response = await axios.get('/nurse/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.data) {
        throw new Error('Empty response data');
      }

      setNurseData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching nurse profile:', error.message);
      setError('Failed to fetch nurse profile');
      setLoading(false);
    }
  };

  const openModal = () => {
    setModalOpen(true);
    // Set initial data for editing
    setEditedData({
      full_name: nurseData[0].full_name,
      dob: new Date(nurseData[0].dob).toLocaleDateString(),
      gender: nurseData[0].gender,
      phone_number: nurseData[0].phone_number,
      email: nurseData[0].email,
      address: nurseData[0].address,
      department: nurseData[0].department,
      shift: nurseData[0].shift,
      employee_id: nurseData[0].employee_id,
      salary: nurseData[0].salary,
      work_from: new Date(nurseData[0].work_from).toLocaleDateString(),
      status: nurseData[0].status,
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
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      await axios.put('/nurse/update_me', editedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      closeModal();
      fetchNurseProfile();
    } catch (error) {
      console.error('Error updating nurse profile:', error.message);
    }
  };

  useEffect(() => {
    fetchNurseProfile();
  }, []);

  console.log('Rendering component with nurseData:', nurseData);

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
          <NurseSidebar />
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
                {nurseData && (
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
                        <MDBTypography tag="h5">{nurseData[0].full_name}</MDBTypography>
                        <MDBCardText>Doctor</MDBCardText>
                        <MDBIcon far icon="edit mb-5" onClick={openModal} />
                    </MDBCol>
                    <MDBCol md="8">
                    
                    <MDBCardBody className="p-4">
                      <MDBTypography style={{ fontWeight: "bold" }} tag="h4">NURSE INFORMATION</MDBTypography>
                      <hr style={{ borderTop: "2px solid black" }} className="mt-0 mb-4" />
                      
                      <MDBRow className="pt-1">
                        

                        <MDBCol size="6" className="mb-3">
                          <MDBTypography style={{ fontWeight: "bold" }} tag="h6">Email</MDBTypography>
                          <MDBCardText className="text-muted">
                            {nurseData[0].email}
                          </MDBCardText>
                        </MDBCol>
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography style={{ fontWeight: "bold" }} tag="h6">Phone</MDBTypography>
                          <MDBCardText className="text-muted">
                            {nurseData[0].phone_number}
                          </MDBCardText>
                          
                        </MDBCol>

                       <MDBCol size="6" className="mb-3">
                          <MDBTypography style={{ fontWeight: "bold" }} tag="h6">Address</MDBTypography>
                          <MDBCardText className="text-muted">
                            {nurseData[0].address}
                          </MDBCardText>
                        </MDBCol>
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography style={{ fontWeight: "bold" }} tag="h6">Date of Birth</MDBTypography>
                          <MDBCardText className="text-muted">
                            {new Date(nurseData[0].dob).toLocaleDateString()}
                          </MDBCardText>
                        </MDBCol>
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography style={{ fontWeight: "bold" }} tag="h6">Gender</MDBTypography>
                          <MDBCardText className="text-muted">
                            {nurseData[0].gender}
                          </MDBCardText>
                        </MDBCol>
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography style={{ fontWeight: "bold" }} tag="h6">Department</MDBTypography>
                          <MDBCardText className="text-muted">
                            {nurseData[0].department}
                          </MDBCardText>
                        </MDBCol>
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography style={{ fontWeight: "bold" }} tag="h6">Shift</MDBTypography>
                          <MDBCardText className="text-muted">
                            {nurseData[0].shift}
                          </MDBCardText>
                        </MDBCol>
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography style={{ fontWeight: "bold" }} tag="h6">Employee ID</MDBTypography>
                          <MDBCardText className="text-muted">
                            {nurseData[0].employee_id}
                          </MDBCardText>
                        </MDBCol>
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography style={{ fontWeight: "bold" }} tag="h6">Salary</MDBTypography>
                          <MDBCardText className="text-muted">
                            {nurseData[0].salary}
                          </MDBCardText>
                        </MDBCol>
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography style={{ fontWeight: "bold" }} tag="h6">Work From</MDBTypography>
                          <MDBCardText className="text-muted">
                            {new Date(nurseData[0].work_from).toLocaleDateString()}
                          </MDBCardText>
                        </MDBCol>
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography style={{ fontWeight: "bold" }} tag="h6">Status</MDBTypography>
                          <MDBCardText className="text-muted">
                            {nurseData[0].status}
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <div className="d-flex justify-content-start">
                        <MDBIcon far icon="edit mb-5" onClick={openModal} />
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
            <MDBModalHeader toggle={closeModal}>Edit Nurse Information</MDBModalHeader>
            <MDBModalBody>
              {/* Use MDBInput for enhanced styling */}
              <MDBInput label="Full Name" type="text" id="full_name" name="full_name" value={editedData.full_name} onChange={handleInputChange} />

              <MDBInput label="Date of Birth" type="date" id="dob" name="dob" value={editedData.dob} onChange={handleInputChange} />

              <MDBInput label="Gender" type="text" id="gender" name="gender" value={editedData.gender} onChange={handleInputChange} />

              <MDBInput label="Phone Number" type="text" id="phone_number" name="phone_number" value={editedData.phone_number} onChange={handleInputChange} />

              <MDBInput label="Email" type="text" id="email" name="email" value={editedData.email} onChange={handleInputChange} />

              <MDBInput label="Address" type="text" id="address" name="address" value={editedData.address} onChange={handleInputChange} />

              <MDBInput label="Department" type="text" id="department" name="department" value={editedData.department} onChange={handleInputChange} />

              <MDBInput label="Shift" type="text" id="shift" name="shift" value={editedData.shift} onChange={handleInputChange} />

              <MDBInput label="Employee ID" type="text" id="employee_id" name="employee_id" value={editedData.employee_id} onChange={handleInputChange} />

              <MDBInput label="Salary" type="text" id="salary" name="salary" value={editedData.salary} onChange={handleInputChange} />

              <MDBInput label="Work From" type="date" id="work_from" name="work_from" value={editedData.work_from} onChange={handleInputChange} />

              <MDBInput label="Status" type="text" id="status" name="status" value={editedData.status} onChange={handleInputChange} />
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
};

export default NurseProfile;
