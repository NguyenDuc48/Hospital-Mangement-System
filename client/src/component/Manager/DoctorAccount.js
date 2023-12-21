import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import Headers from '../Landings/Header';
import ManagerSidebar from './ManagerSidebar';

function DoctorAccount() {
  const [doctors, setDoctors] = useState([]);
  const [show, setShow] = useState(false);
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
      const response = await axios.post('/manager/add_doctor', formData);
      console.log(response.data);
      fetchData();
      handleClose();
    } catch (error) {
      console.error('Error adding doctor:', error);
    }
  };

  return (
    <div>
      <Headers />
      <div style={{ display: 'flex', overflowY: "auto", width: "100%", flexWrap: 'wrap' }}>
        <div style={{ width: '25%' }}>
          <ManagerSidebar />
        </div>
        <div style={{ height: '100vh', overflow: 'scroll initiali', width: '70%' }}>
          <br />
          <div className="container ">
            <div className="crud shadow-lg p-3 mb-5 mt-5 bg-body rounded">
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
                            <a href="#" className="view" title="View" data-toggle="tooltip" style={{ color: "#10ab80" }}>
                              <i className="material-icons">&#xE417;</i>
                            </a>
                            <a href="#" className="edit" title="Edit" data-toggle="tooltip">
                              <i className="material-icons">&#xE254;</i>
                            </a>
                            <a href="#" className="delete" title="Delete" data-toggle="tooltip" style={{ color: "red" }}>
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
          </div>


                
             

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorAccount;
