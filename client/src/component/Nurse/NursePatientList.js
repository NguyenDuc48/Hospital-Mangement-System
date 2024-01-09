import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import NurseSidebar from './NurseSidebar';
import { Button, InputGroup, FormControl, Modal, Form, Toast } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const NursePatientList = () => {
  const [patientList, setPatientList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [departmentId, setDepartmentId] = useState('');
  const [description, setDescription] = useState('');
  const [showToast, setShowToast] = useState(false);

  const fetchAllPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      const response = await axios.get('/nurse/all_patient', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.data) {
        throw new Error('Empty response data');
      }

      setPatientList(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching all patients:', error.message);
      setError('Failed to fetch patient list');
      setLoading(false);
    }
  };

  const searchPatients = async () => {
    try {
      const response = await axios.get(`/nurse/all_patient/search/${encodeURIComponent(searchInput)}`);

      if (!response.data) {
        throw new Error('Empty response data');
      }

      setPatientList(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error searching patients:', error.message);
      setError('Failed to search patients');
      setLoading(false);
    }
  };

  const addPatientToWaitlist = async () => {
    try {
      const response = await axios.post('/nurse/add_waiting_patient', {
        patient_id: selectedPatient.patient_id,
        department_id: departmentId,
        description: description,
      });

      console.log('Add to waitlist response:', response.data);

      // Display the success toast
      setShowToast(true);

      // Hide the toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 3000);

      // You may want to update the state or perform additional actions based on the response
      handleCloseModal();
    } catch (error) {
      console.error('Error adding patient to waitlist:', error.message);
      // Handle error
    }
  };

  const handleSearch = () => {
    searchPatients();
  };

  const handleShowModal = (patient) => {
    setSelectedPatient(patient);
    setDepartmentId('');
    setDescription('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  useEffect(() => {
    if (searchInput) {
      searchPatients(searchInput);
    } else {
      fetchAllPatients();
    }
  }, [searchInput]);


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
        <div style={{ width: '25%', marginBottom: '20px' }}>
          <NurseSidebar />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'scroll',
            width: '70%',
            padding: '20px',
          }}
        >
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <InputGroup className="" style={{ width: '50%' }}>
              <FormControl
                placeholder="Search by telephone..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {/* <Button variant="outline-secondary" onClick={handleSearch}>
                Search
              </Button> */}
            </InputGroup>
            <Button
              variant="secondary"
              style={{ marginLeft: '10px', width: '15%' }}
              onClick={() => {
                const departmentId = prompt('Enter the department_id:');
                const description = prompt('Enter the description:');
                if (departmentId && description) {
                  addPatientToWaitlist(selectedPatient.patient_id, departmentId, description);
                }
              }}
            >
              Add Patient
            </Button>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <>
              <table className="table table-bordered table-striped">
                <thead className="thead-light">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Date of Birth</th>
                    <th>Gender</th>
                    <th>Phone Number</th>
                    <th>Address</th>
                    <th>Email</th>
                    <th>Health Insurance Percent</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {patientList.map((patient, index) => (
                    <tr key={patient.patient_id} className={index % 2 === 0 ? 'table-light' : 'table-white'}>
                      <td>{patient.patient_id}</td>
                      <td>{patient.full_name}</td>
                      <td>{new Date(patient.dob).toLocaleDateString()}</td>
                      <td>{patient.gender}</td>
                      <td>{patient.phone_number}</td>
                      <td>{patient.address}</td>
                      <td>{patient.email}</td>
                      <td>{`${patient.health_insurance_percent}%`}</td>
                      <td>
                        <Button style={{backgroundColor: "#177347"}} onClick={() => handleShowModal(patient)}>
                          Add Waitlist
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Add Patient to Waitlist</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="departmentId">
                      <Form.Label>Department ID:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter department ID"
                        value={departmentId}
                        onChange={(e) => setDepartmentId(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group controlId="description">
                      <Form.Label>Description:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={addPatientToWaitlist}>
                    Add to Waitlist
                  </Button>
                </Modal.Footer>
              </Modal>

              <Toast
                show={showToast}
                onClose={() => setShowToast(false)}
                delay={3000}
                autohide
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  backgroundColor: 'green',
                  color: 'white',
                }}
              >
                <Toast.Header>
                  <strong className="mr-auto">Success</strong>
                </Toast.Header>
                <Toast.Body>Patient added to waitlist successfully!</Toast.Body>
              </Toast>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NursePatientList;
