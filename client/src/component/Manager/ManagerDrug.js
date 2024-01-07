import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import Headers from '../Manager/Header';
import ManagerSidebar from './ManagerSidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './manager.css';

function ManagerDrugs() {
  const [drugs, setDrugs] = useState([]);
  const [show, setShow] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDrugId, setEditingDrugId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deletingDrugId, setDeletingDrugId] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formData, setFormData] = useState({
    drug_id: '',
    drug_name: '',
    price: '',
    origin: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/manager/view_drugs');
      setDrugs(response.data);
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
      const response = await axios.post('http://localhost:5000/manager/add_drug', formData);
      console.log(response.data);
      fetchData();
      handleClose();

      toast.success('Drug added successfully!', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('Error adding drug:', error);
    }
  };

  const handleCloseModal = () => setShowEditModal(false);

  const handleShowEditModal = (drugId) => {
    const editingDrug = drugs.find((drug) => drug.drug_id === drugId);
    setFormData(editingDrug);
    setEditingDrugId(drugId);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://localhost:5000/manager/update_drug', formData);
      console.log(response.data);
      fetchData();
      handleCloseModal();

      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    } catch (error) {
      console.error('Error updating drug:', error);
    }
  };

  const handleShowDeleteConfirmation = (drugId) => {
    setDeletingDrugId(drugId);
    setShowDeleteConfirmation(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setDeletingDrugId(null);
    setShowDeleteConfirmation(false);
  };

  const handleDeleteDrug = async () => {
    try {
      const deleteResponse = await axios.delete('http://localhost:5000/manager/delete_drug', {
        data: { drug_id: deletingDrugId },
      });

      if (deleteResponse.data.success) {
        fetchData();
      } else {
        console.error('Error deleting drug:', deleteResponse.data.error);
      }
    } catch (error) {
      console.error('Error deleting drug:', error);
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
              {showSuccessMessage && (
                <div className="success-message">
                  <p>Record updated successfully!</p>
                </div>
              )}

              <div>
                <div className="row" style={{ backgroundColor: '#425D7D', padding: '0px' }}>
                  <div className="col-sm-7 offset-sm-1 mt-3 mb-2 text-gred" style={{ color: 'white' }}>
                    <h2>
                      <b>Drug Management</b>
                    </h2>
                  </div>
                  <div className="col-sm-3 offset-sm-1 mt-3 mb-2 text-gred">
                    <Button variant="primary" onClick={handleShow} style={{ backgroundColor: '#5DB85C' }}>
                      Add New Drug
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
                        <th>Price</th>
                        <th>Origin</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drugs.map((drug) => (
                        <tr key={drug.drug_id}>
                          <td>{drug.drug_id}</td>
                          <td>{drug.drug_name}</td>
                          <td>{drug.price}</td>
                          <td>{drug.origin}</td>
                          <td>
                            <a
                              href="#"
                              className="edit"
                              title="Edit"
                              data-toggle="tooltip"
                              onClick={() => handleShowEditModal(drug.drug_id)}
                            >
                              <i className="material-icons">&#xE254;</i>
                            </a>
                            <a
                              href="#"
                              className="delete"
                              title="Delete"
                              data-toggle="tooltip"
                              style={{ color: 'red' }}
                              onClick={() => handleShowDeleteConfirmation(drug.drug_id)}
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

              <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                  <Modal.Title>Add drug</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formDrugID">
                      <Form.Label>Drug ID</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Drug ID"
                        name="drug_id"
                        value={formData.drug_id}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group controlId="formDrugName">
                      <Form.Label>Drug Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Drug Name"
                        name="drug_name"
                        value={formData.drug_name}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group controlId="formDosage">
                      <Form.Label>Dosage</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Dosage"
                        name="dosage"
                        value={formData.dosage}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group controlId="formDescription">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                      Submit
                    </Button>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>

              <Modal show={showEditModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit Drug</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={handleEditSubmit}>
                    <Form.Group controlId="formDrugName">
                      <Form.Label>Drug Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Drug Name"
                        name="drug_name"
                        value={formData.drug_name}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group controlId="formDosage">
                      <Form.Label>Dosage</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Dosage"
                        name="dosage"
                        value={formData.dosage}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group controlId="formDescription">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Description"
                        name="description"
                        value={formData.description}
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

              <Modal show={showDeleteConfirmation} onHide={handleCloseDeleteConfirmation} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                  <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>Are you sure you want to delete this drug?</p>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseDeleteConfirmation}>
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={handleDeleteDrug}>
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

export default ManagerDrugs;
