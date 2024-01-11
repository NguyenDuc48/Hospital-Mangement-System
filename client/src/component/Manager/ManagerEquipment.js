import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import Headers from './Header';
import ManagerSidebar from './ManagerSidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './manager.css';

function ManagerEquipment() {
  const [equipments, setEquipments] = useState([]);
  const [show, setShow] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEquipmentId, setEditingEquipmentId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deletingEquipmentId, setDeletingEquipmentId] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formData, setFormData] = useState({
    equipment_id: '',
    equipment_name: '',
    quantity: '',
    description: '',
    fee_per_day: ''
  });

  useEffect(() => {
    fetchData();
  }, [equipments]);

  const fetchData = async () => {
    try {
      const response = await axios.get('/manager/view_equipments');
      setEquipments(response.data);
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
      const response = await axios.post('/manager/add_equipment', {
        name: formData.equipment_name,
        quantity_left: formData.quantity,
        fee_per_day: formData.fee_per_day,
      });

      console.log(response.data);
      fetchData();
      handleClose();

      toast.success('Equipment added successfully!', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('Error adding equipment:', error);
    }
  };

  const handleCloseModal = () => setShowEditModal(false);

  const handleShowEditModal = (equipmentId) => {
    const editingEquipment = equipments.find((equipment) => equipment.equipment_id === equipmentId);

    // Ensure that properties in editingEquipment match the properties in formData
    const { equipment_id, name, quantity_left, fee_per_day } = editingEquipment;

    setFormData({
      equipment_id,
      equipment_name: name,
      quantity: quantity_left,
      fee_per_day
    });

    setEditingEquipmentId(equipmentId);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/manager/update_equipment', {
        equipment_id: formData.equipment_id,
        name: formData.equipment_name,
        quantity_left: formData.quantity,
        fee_per_day: formData.fee_per_day
      });

      console.log(response.data);
      // fetchData();
      handleCloseModal();

      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    } catch (error) {
      console.error('Error updating equipment:', error);
    }
  };


  const handleShowDeleteConfirmation = (equipmentId) => {
    setDeletingEquipmentId(equipmentId);
    setShowDeleteConfirmation(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setDeletingEquipmentId(null);
    setShowDeleteConfirmation(false);
  };

  const handleDeleteEquipment = async () => {
    try {
      const deleteResponse = await axios.delete('/manager/delete_equipment', {
        data: { equipment_id: deletingEquipmentId },
      });

      if (deleteResponse.data.success) {
        fetchData();
      } else {
        console.error('Error deleting equipment:', deleteResponse.data.error);
      }
    } catch (error) {
      console.error('Error deleting equipment:', error);
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
                      <b>List of equipments</b>
                    </h2>
                  </div>
                  <div className="col-sm-3 offset-sm-1 mt-3 mb-2 text-gred">
                    <Button variant="primary" onClick={handleShow} style={{ backgroundColor: '#5DB85C' }}>
                      Add New Equipment
                    </Button>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="table-responsive ">
                  <table className="table table-striped table-hover table-bordered">
                    <thead>
                      <tr>
                        <th className="text-center align-middle">ID</th>
                        <th className="text-center align-middle">Name</th>
                        <th className="text-center align-middle">Quantity left</th>
                        <th className="text-center align-middle">Fee per day</th>
                        <th className="text-center align-middle">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {equipments.map((equipment) => (
                        <tr key={equipment.equipment_id}>
                          <td className="text-center align-middle">{equipment.equipment_id}</td>
                          <td className="text-center align-middle">{equipment.name}</td>
                          <td className="text-center align-middle">{equipment.quantity_left}</td>
                          <td className="text-center align-middle">{equipment.fee_per_day}</td>
                          <td className="text-center align-middle">
                            <a
                              href="#"
                              className="edit"
                              title="Edit"
                              data-toggle="tooltip"
                              onClick={() => handleShowEditModal(equipment.equipment_id)}
                            >
                              <i className="material-icons">&#xE254;</i>
                            </a>
                            <a
                              href="#"
                              className="delete"
                              title="Delete"
                              data-toggle="tooltip"
                              style={{ color: 'red' }}
                              onClick={() => handleShowDeleteConfirmation(equipment.equipment_id)}
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
                  <Modal.Title>Add equipment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formEquipmentName">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter equipment's name"
                        name="equipment_name"
                        value={formData.equipment_name}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formQuantity">
                      <Form.Label>Quantity</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formDescription">
                      <Form.Label>Fee per day</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter fee"
                        name="fee_per_day"
                        value={formData.fee_per_day}
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
                  <Modal.Title>Edit Equipment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={handleEditSubmit}>
                    <Form.Group controlId="formEquipmentName">
                      <Form.Label>Equipment Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Equipment Name"
                        name="equipment_name"
                        value={formData.equipment_name}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group controlId="formQuantity">
                      <Form.Label>Quantity</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter Quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    <Form.Group controlId="formDescription">
                      <Form.Label>Fee Per Day</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Fee"
                        name="fee_per_day"
                        value={formData.fee_per_day}
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
                  <p>Are you sure you want to delete this equipment?</p>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseDeleteConfirmation}>
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={handleDeleteEquipment}>
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

export default ManagerEquipment;
