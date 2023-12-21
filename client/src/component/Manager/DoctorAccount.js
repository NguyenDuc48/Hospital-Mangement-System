import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import Headers from "../Landings/Header";
import ManagerSidebar from "./ManagerSidebar";

function DoctorAccount() {
  const [doctors, setDoctors] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Fetch data from your API when the component mounts
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/manager/get_doctor'); // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
                <Modal
                  show={show}
                  onHide={handleClose}
                  backdrop="static"
                  keyboard={false}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Add Employee</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <form>
                      <div className="form-group">
                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Name" />
                      </div>
                      <div className="form-group mt-3">
                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Country" />
                      </div>
                      <div className="form-group mt-3">
                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter City" />
                      </div>
                      <div className="form-group mt-3">
                        <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Enter Country" />
                      </div>
                      <button type="submit" className="btn btn-success mt-4">Add Record</button>
                    </form>
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
