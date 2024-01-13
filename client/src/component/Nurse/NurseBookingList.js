import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import NurseSidebar from './NurseSidebar';
import { Button, InputGroup, FormControl, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import jwt from 'jsonwebtoken';

const NurseBookingList = () => {
  const [bookedList, setBookedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [departmentId, setDepartmentId] = useState('');
  const [description, setDescription] = useState('');
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
          if (decoded.userId.substring(0,2) === "YT") 
            setValidAccess(true);
          else setValidAccess(false)
        }
    };
    decodeToken();
  },[]);
  const fetchAllBookedPatients = async () => {
    try {
      const response = await axios.get('/nurse/all_booked_patient');
      if (!response.data) {
        throw new Error('Empty response data');
      }
      setBookedList(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching booked patients:', error.message);
      setError('Failed to fetch booked patient list');
      setLoading(false);
    }
  };

  const searchBookedPatients = async (input) => {
    try {
      const response = await axios.get(`/nurse/all_booked_patient/search/${encodeURIComponent(input)}`);
      if (!response.data) {
        throw new Error('Empty response data');
      }
      setBookedList(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error searching booked patients:', error.message);
      setError('Failed to search booked patients');
      setLoading(false);
    }
  };

  const deletePatientFromBookedList = async (patientId) => {
    try {
      const response = await axios.delete('/nurse/add_waiting_patient', {
        data: {
          patient_id: patientId,
        },
      });

      if (!response.data) {
        throw new Error('Empty response data');
      }

      // Handle success or show success toast for deletion from booked list
    } catch (error) {
      console.error('Error deleting patient from booked list:', error.message);
      // Handle error or show error toast for deletion
    }
  };

  useEffect(() => {
    if (searchInput) {
      searchBookedPatients(searchInput);
    } else {
      fetchAllBookedPatients();
    }
  }, [searchInput]);

  const handleShowModal = (patientId) => {
    setSelectedPatientId(patientId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPatientId(null);
    setDepartmentId('');
    setDescription('');
  };

  const addPatientToWaitlist = async () => {
    try {
      const response = await axios.post('/nurse/add_waiting_patient', {
        patient_id: selectedPatientId,
        department_id: departmentId,
        description: description,
      });

      if (!response.data) {
        throw new Error('Empty response data');
      }

      // Successfully added to waitlist, now delete from booked list
      await deletePatientFromBookedList(selectedPatientId);

      // Show success toast here
      handleCloseModal();
    } catch (error) {
      console.error('Error adding patient to waitlist:', error.message);
      // Show error toast here
    }
  };

  useEffect(() => {
    fetchAllBookedPatients();
  }, [bookedList]);
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
                placeholder="Search by patient name, phone, or ID..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </InputGroup>
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
                    <th>Patient ID</th>
                    <th>Name</th>
                    <th>Phone Number</th>
                    <th>Booked Date</th>
                    <th>Booked Time</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookedList.map((booking, index) => (
                    <tr key={booking.patient_id} className={index % 2 === 0 ? 'table-light' : 'table-white'}>
                      <td>{booking.patient_id}</td>
                      <td>{booking.full_name}</td>
                      <td>{booking.phone_number}</td>
                      <td>{new Date(booking.booked_date).toLocaleDateString()}</td>
                      <td>{booking.booked_time}</td>
                      <td>{booking.description}</td>
                      <td>
                        <Button style={{backgroundColor: "#177347"}} variant="success" onClick={() => handleShowModal(booking.patient_id)}>
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
            </>
          )}
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

export default NurseBookingList;
