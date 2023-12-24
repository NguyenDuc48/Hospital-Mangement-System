import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import Headers from '../Manager/Header';
import ManagerSidebar from './ManagerSidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './manager.css'

function DoctorAccount() {
  const [doctors, setDoctors] = useState([]);
  const [show, setShow] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // Added state for edit modal
  const [editingDoctorId, setEditingDoctorId] = useState(null); // Added state to track which doctor is being edited
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingDoctor, setViewingDoctor] = useState(null);
  const [deletingDoctorId, setDeletingDoctorId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formData, setFormData] = useState({
    doctor_id: '',
    full_name: '',
    dob: '',
    gender: '',
    phone_number: '',
    email: '',
    address: '',
    salary: '',
    work_from: '',
    expertise: '',
    department: '',
    password: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/manager/get_doctor');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  //add 
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post('/manager/add_doctor', formData);
  //     console.log(response.data);
  //     fetchData();
  //     handleClose();
  //   } catch (error) {
  //     console.error('Error adding doctor:', error);
  //   }
  // };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/manager/add_doctor', formData);
      console.log(response.data);
      fetchData();
      handleClose();
  
      // Show success toast
      toast.success('Record added successfully!', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('Error adding doctor:', error);
    }
  };
  

  ///edit

  const handleCloseModal = () => setShowEditModal(false);

  const handleShowEditModal = (doctorId) => {
    const editingDoctor = doctors.find((doctor) => doctor.doctor_id === doctorId);
    setFormData(editingDoctor);
    setEditingDoctorId(doctorId);
    setShowEditModal(true);
  };

  // const handleEditSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.put('/manager/update_doctor', formData);
  //     console.log(response.data);
  //     fetchData();
  //     handleCloseModal();
  //   } catch (error) {
  //     console.error('Error updating doctor:', error);
  //   }
  // }; 

  // const handleEditSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.put('/manager/update_doctor', formData);
  //     console.log(response.data);
  //     fetchData();
  //     handleCloseModal();
  
  //     // Show success toast
  //     toast.success('Record updated successfully!', {
  //       position: 'bottom-right',
  //       autoClose: 2000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //     });
  //   } catch (error) {
  //     console.error('Error updating doctor:', error);
  //   }
  // };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/manager/update_doctor', formData);
      console.log(response.data);
      fetchData();
      handleCloseModal();

      // Set showSuccessMessage to true
      setShowSuccessMessage(true);

      // Reset showSuccessMessage after a certain time (e.g., 5 seconds)
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    } catch (error) {
      console.error('Error updating doctor:', error);
    }
  };
  
  //view
  const handleToggleViewModal = () => {
    setShowViewModal(!showViewModal);
  };
  const handleShowViewModal = (doctorId) => {
    const viewingDoctor = doctors.find((doctor) => doctor.doctor_id === doctorId);
    setViewingDoctor(viewingDoctor);
    setShowViewModal(true);
  };

  const handleShowDeleteConfirmation = (doctorId) => {
    setDeletingDoctorId(doctorId);
    setShowDeleteConfirmation(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setDeletingDoctorId(null);
    setShowDeleteConfirmation(false);
  };

  // const handleDeleteDoctor = async () => {
  //   try {
  //     const response = await axios.delete('/manager/delete_doctor', {
  //       data: { doctor_id: deletingDoctorId },
  //     });

  //     if (response.data.success) {
  //       // setSuccessMessage('Doctor deleted successfully');
  //       fetchData();
  //     } else {
  //       console.error('Error deleting doctor:', response.data.message);
  //     }
  //   } catch (error) {
  //     console.error('Error deleting doctor:', error);
  //   }

  //   handleCloseDeleteConfirmation();
  // };
  const handleDeleteDoctor = async () => {
    try {
      // Step 1: Delete the doctor's account
      const deleteResponse = await axios.delete('/manager/delete_doctor', {
        data: { doctor_id: deletingDoctorId },
      });
  
      if (deleteResponse.data.success) {
        // Step 2: Update the doctor's status
        const updateResponse = await axios.put('/manager/delete_doctor', {
          doctor_id: deletingDoctorId,
        });
  
        if (updateResponse.data.success) {
          fetchData(); // Fetch updated data
        } else {
          console.error('Error updating doctor status:', updateResponse.data.error);
        }
      } else {
        console.error('Error deleting doctor:', deleteResponse.data.error);
      }
    } catch (error) {
      console.error('Error deleting/updating doctor:', error);
    }
  
    handleCloseDeleteConfirmation();
  };
  
  
  
    

  return (
    <div>
      <Headers />
      <ToastContainer position="bottom-right" autoClose={2000} />
      <div style={{ display: 'flex', overflowY: "auto", width: "100%", flexWrap: 'wrap' }}>
        <div style={{ width: '25%' }}>
          <ManagerSidebar />
        </div>
        <div style={{ height: '100vh', overflow: 'scroll initiali', width: '70%' }}>
          <br />
          <div className="container ">
            <div className="crud shadow-lg p-3 mb-5 mt-5 bg-body rounded">
              {/* Display the success message */}
              {showSuccessMessage && (
                <div className="success-message">
                  <p>Record updated successfully!</p>
                </div>
              )}

              <div>
                <div className="row" style={{ backgroundColor: '#425D7D', padding: "0px" }}>
                  <div className="col-sm-7 offset-sm-1 mt-3 mb-2 text-gred" style={{ color: "white" }}>
                    <h2><b>Doctor Management</b></h2>
                  </div>
                  <div className="col-sm-3 offset-sm-1  mt-3 mb-2 text-gred">
                    <Button variant="primary" onClick={handleShow} style={{ backgroundColor: "#5DB85C" }}>
                      Add New Doctor
                    </Button>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="table-responsive " >
                  <table className="table table-striped table-hover table-bordered">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Expertise</th>
                        <th>Salary</th>
                        <th>Actions</th>
                        
                      </tr>
                    </thead>
                    <tbody>
                      {doctors.map((doctor) => (
                        <tr key={doctor.doctor_id}>
                          <td>{doctor.doctor_id}</td>
                          <td>{doctor.full_name}</td>
                          <td>{doctor.address}</td>
                          <td>{doctor.expertise}</td>
                          <td>{doctor.salary}</td>
                          <td>
                            <a
                              href="#"
                              className="view"
                              title="View"
                              data-toggle="tooltip"
                              style={{ color: "#10ab80" }}
                              onClick={() => handleShowViewModal(doctor.doctor_id)}
                            >
                              <i className="material-icons">&#xE417;</i>
                            </a>
                             <a
                              href="#"
                              className="edit"
                              title="Edit"
                              data-toggle="tooltip"
                              onClick={() => handleShowEditModal(doctor.doctor_id)}
                               >
                              <i className="material-icons">&#xE254;</i>
                            </a>
                             <a
                              href="#"
                              className="delete"
                              title="Delete"
                              data-toggle="tooltip"
                              style={{ color: "red" }}
                              onClick={() => handleShowDeleteConfirmation(doctor.doctor_id)}
                            >
                              <i className="material-icons">&#xE872;</i>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="model_box">
            {/* View Doctor Modal */}
            <Modal show={showViewModal} onHide={handleToggleViewModal} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
              <Modal.Title>View Doctor</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {viewingDoctor && (
                <div className="view-doctor-details">
                  <p>
                    <strong>Doctor ID:</strong> {viewingDoctor.doctor_id}
                  </p>
                  <p>
                    <strong>Full Name:</strong> {viewingDoctor.full_name}
                  </p>
                  <p>
                    <strong>Date of Birth:</strong> {viewingDoctor.dob}
                  </p>
                  {/* Add similar lines for other details */}
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleToggleViewModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
            {/* Add Doctor Modal */}
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
              <Modal.Header closeButton>
                <Modal.Title>Add Employee</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formDoctorID">
                    <Form.Label>Doctor ID</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Doctor ID"
                      name="doctor_id"
                      value={formData.doctor_id}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="formFullName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Full Name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                    />
                  </Form.Group>


                  {/* Add similar blocks for other form fields */}
                  <Form.Group controlId="formDOB">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      placeholder="Enter Date of Birth"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  {/* Add similar blocks for other form fields */}
                  <Form.Group controlId="formGender">
                    <Form.Label>Gender</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Date of Birth"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                    
                    {/* Add similar blocks for other form fields */}
                  <Form.Group controlId="formPhoneNumber">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Phone Number"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                    
                    {/* Add similar blocks for other form fields */}
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                    
                    {/* Add similar blocks for other form fields */}
                  <Form.Group controlId="formAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                    
                    {/* Add similar blocks for other form fields */}
                  <Form.Group controlId="formSalary">
                    <Form.Label>Salary</Form.Label>
                    <Form.Control
                      type="decimal"
                      placeholder="Enter Salary"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                    
                    {/* Add similar blocks for other form fields */}
                  <Form.Group controlId="formWorkFrom">
                    <Form.Label>Work From</Form.Label>
                    <Form.Control
                      type="date"
                      placeholder="Enter Work From"
                      name="work_from"
                      value={formData.work_from}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                    
                    {/* Add similar blocks for other form fields */}
                  <Form.Group controlId="formExpertise">
                    <Form.Label>Expertise</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Expertise"
                      name="expertise"
                      value={formData.expertise}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                    
                    {/* Add similar blocks for other form fields */}
                  <Form.Group controlId="formDepartment">
                    <Form.Label>Department</Form.Label>
                    <Form.Control
                      type="int"
                      placeholder="Enter Department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                    
                    {/* Add similar blocks for other form fields */}
                  <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Add Record
                  </Button>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Edit Doctor Modal */}
            <Modal show={showEditModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Doctor</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleEditSubmit}>
                  {/* Form fields for editing doctor information */}
                  <Form.Group controlId="formExpertise">
                    <Form.Label>Expertise</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Expertise"
                      name="expertise"
                      value={formData.expertise}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="formDepartment">
                    <Form.Label>Department</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit">
                    Save Changes
                  </Button>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>


               {/* Delete Confirmation Modal */}
            <Modal show={showDeleteConfirmation} onHide={handleCloseDeleteConfirmation} backdrop="static" keyboard={false}>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Are you sure you want to delete this doctor?</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseDeleteConfirmation}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleDeleteDoctor}>
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>

          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorAccount;
