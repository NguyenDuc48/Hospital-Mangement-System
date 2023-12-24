import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import Headers from '../Manager/Header';
import ManagerSidebar from './ManagerSidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './manager.css';

function NurseAccount() {
  const [nurses, setNurses] = useState([]);
  const [show, setShow] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingNurseId, setEditingNurseId] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewModalData, setViewModalData] = useState(null);
  const [viewingNurse, setViewingNurse] = useState(null);
  const [formData, setFormData] = useState({
    nurse_id: '',
    full_name: '',
    dob: '',
    gender: '',
    phone_number: '',
    email: '',
    address: '',
    salary: '',
    work_from: '',
    department: '',
    password: '',
    shift: '',
  });

  useEffect(() => {
    fetchNurses();
  }, []);

  const fetchNurses = async () => {
    try {
      const response = await axios.get('/manager/get_nurse');
      setNurses(response.data);
    } catch (error) {
      console.error('Error fetching nurse data:', error);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/manager/add_nurse', formData);
      console.log(response.data);
      fetchNurses();
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
      console.error('Error adding nurse:', error);
    }
  };


  const handleCloseModal = () => setShowEditModal(false);

  //view
  // const handleToggleViewModal = () => {
  //   setShowViewModal(!showViewModal);
  // };
  const handleToggleViewModal = () => {
    // Reset the viewingNurse state to null when closing the modal
    setViewingNurse(null);
    setShowViewModal(!showViewModal);
  };
  
  const handleShowViewModal = (nurseId) => {
    // Assuming you have a state variable to store the details of the selected nurse
    const selectedNurse = nurses.find((nurse) => nurse.nurse_id === nurseId);
  
    // Assuming you have a state variable to control the visibility of the view modal
    setViewModalData(selectedNurse);
    setShowViewModal(true);
  };
  
  const handleShowEditModal = (nurseId) => {
    const editingNurse = nurses.find((nurse) => nurse.nurse_id === nurseId);
    setFormData(editingNurse);
    setEditingNurseId(nurseId);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/manager/update_nurse', formData);
      console.log(response.data);
      fetchNurses();
      handleCloseModal();

      // Set showSuccessMessage to true
      setShowSuccessMessage(true);

      // Reset showSuccessMessage after a certain time (e.g., 5 seconds)
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    } catch (error) {
      console.error('Error updating nurse:', error);
    }
  };
//delete
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deletingNurseId, setDeletingNurseId] = useState(null);
  const handleShowDeleteConfirmation = (nurseId) => {
    setDeletingNurseId(nurseId);
    setShowDeleteConfirmation(true);
  }
  const handleCloseDeleteConfirmation = () => {
    setDeletingNurseId(null);
    setShowDeleteConfirmation(false);
  }
  const handleDeleteNurse = async () => {
    try {
      // Step 1: Delete the nurse's account
      const deleteResponse = await axios.delete('/manager/delete_nurse', {
        data: { nurse_id: deletingNurseId },
      });
  
      if (deleteResponse.data.success) {
        // Step 2: Update the nurse's status
        const updateResponse = await axios.put('/manager/delete_nurse', {
          nurse_id: deletingNurseId,
        });
  
        if (updateResponse.data.success) {
          fetchNurses(); // Fetch updated data
        } else {
          console.error('Error updating nurse status:', updateResponse.data.error);
        }
      } else {
        console.error('Error deleting nurse:', deleteResponse.data.error);
      }
    } catch (error) {
      console.error('Error deleting/updating nurse:', error);
    }
  
    handleCloseDeleteConfirmation();
  };
  

  return (
    <div>
      <Headers />
      <ToastContainer position="bottom-right" autoClose={2000} />
      <div style={{ display: 'flex', overflowY: 'auto', width: '100%', flexWrap: 'wrap' }}>
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
                <div className="row" style={{ backgroundColor: '#425D7D', padding: '0px' }}>
                  <div className="col-sm-7 offset-sm-1 mt-3 mb-2 text-gred" style={{ color: 'white' }}>
                    <h2>
                      <b>Nurse Management</b>
                    </h2>
                  </div>
                  <div className="col-sm-3 offset-sm-1  mt-3 mb-2 text-gred">
                    <Button variant="primary" onClick={handleShow} style={{ backgroundColor: '#5DB85C' }}>
                      Add New Nurse
                    </Button>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="table-responsive ">
                  <table className="table table-striped table-hover table-bordered">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Birth</th>
                        <th>Gender</th>
                        <th>Phone</th>
                        <th>Department</th>
                        <th>Shift</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nurses.map((nurse) => (
                        <tr key={nurse.nurse_id}>
                        <td>{nurse.nurse_id}</td>
                        <td>{nurse.full_name}</td>
                        <td>{nurse.dob}</td>
                        <td>{nurse.gender}</td>
                        <td>{nurse.phone_number}</td>
                        <td>{nurse.department}</td>
                        <td>{nurse.shift}</td>
                        <td>
                            <a
                              href="#"
                              className="view"
                              title="View"
                              data-toggle="tooltip"
                              style={{ color: "#10ab80" }}
                              onClick={() => handleShowViewModal(nurse.nurse_id)}
                            >
                              <i className="material-icons">&#xE417;</i>
                            </a>
                            <a
                            href="#"
                            className="edit"
                            title="Edit"
                            data-toggle="tooltip"
                            onClick={() => handleShowEditModal(nurse.nurse_id)}
                            >
                            <i className="material-icons">&#xE254;</i>
                            </a>
                            <a
                              href="#"
                              className="delete"
                              title="Delete"
                              data-toggle="tooltip"
                              style={{ color: "red" }}
                              onClick={() => handleShowDeleteConfirmation(nurse.nurse_id)}
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

            {/* Add Nurse Modal */}
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                <Modal.Title>Add Nurse</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {/* Form fields for adding nurse */}
                    {/* ... (similar blocks for other form fields) */}
                    <Form.Group controlId="formNurseID">
                    <Form.Label>Nurse ID</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Nurse ID"
                      name="nurse_id"
                      value={formData.nurse_id}
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
                  <Form.Group controlId="formGender">
                    <Form.Label>Gender</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder='Enter gender'
                      name="gender"
                      value={formData.gender}

                      onChange={handleInputChange}
                    />
                  </Form.Group>
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
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                    type='text'
                      placeholder="Enter Email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
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
                  <Form.Group controlId="formShift">
                    <Form.Label>Shift</Form.Label>
                    <Form.Control

                      type="text"
                      placeholder="Enter Shift"
                      name="shift"
                      value={formData.shift}
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
            {/* view nurse modal */}
            <Modal show={showViewModal} onHide={handleToggleViewModal} backdrop="static" keyboard={false}>
              <Modal.Header closeButton>
                <Modal.Title>View Nurse</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {viewModalData && (
                  <div className="view-nurse-details">
                    <p>
                      <strong>Nurse ID:</strong> {viewModalData.nurse_id}
                    </p>
                    <p>
                      <strong>Full Name:</strong> {viewModalData.full_name}
                    </p>
                    <p>
                      <strong>Date of Birth:</strong> {viewModalData.dob}
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


            {/* Edit Nurse Modal */}
            <Modal show={showEditModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                <Modal.Title>Edit Nurse</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form onSubmit={handleEditSubmit}>
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
                  <Form.Group controlId="formShift">
                    <Form.Label>Shift</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Shift"
                      name="shift"
                      value={formData.shift}
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
            {/* Delete Confirmation Modal for Nurses */}
            <Modal show={showDeleteConfirmation} onHide={handleCloseDeleteConfirmation} backdrop="static" keyboard={false}>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Are you sure you want to delete this nurse?</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseDeleteConfirmation}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleDeleteNurse}>
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>

            </div>
        </div>
        </div>
    </div>
    </div>
);
}

export default NurseAccount;

