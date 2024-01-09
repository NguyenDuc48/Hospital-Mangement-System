import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import Headers from './Header';
import ManagerSidebar from './ManagerSidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './manager.css';

function ManagerDepartment() {
    const [departments, setDepartments] = useState([]);
    const [show, setShow] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingDepartmentId, setEditingDepartmentId] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deletingDepartmentId, setDeletingDepartmentId] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [formData, setFormData] = useState({
        department_id: '',
        department_name: '',
        description: '',
        head_of_department: '',
        department_phone: '',
        department_email: '',
        department_address: ''
    });

    useEffect(() => {
        fetchData();
    }, [departments]);

    const fetchData = async () => {
        try {
            const response = await axios.get('/manager/view_departments');
            setDepartments(response.data);
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
            const response = await axios.post('/manager/add_department', formData);
            console.log(response.data);
            fetchData();
            handleClose();

            toast.success('Department added successfully!', {
                position: 'bottom-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            console.error('Error adding department:', error);
        }
    };

    const handleCloseModal = () => setShowEditModal(false);

    const handleShowEditModal = (departmentId) => {
        const editingDepartment = departments.find((department) => department.department_id === departmentId);

        if (!editingDepartment) {
            console.error(`Editing department with ID ${departmentId} not found.`);
            return;
        }

        // Ensure that properties in editingDepartment match the properties in formData
        const { department_id, department_name, description, head_of_department, department_phone, department_email, department_address } = editingDepartment;

        console.log("Editing Department:", editingDepartment);

        setFormData({
            department_id,
            department_name,
            description,
            head_of_department,
            department_phone,
            department_email,
            department_address
        });

        setEditingDepartmentId(departmentId);
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('/manager/update_department', formData);

            console.log(response.data);
            fetchData();
            handleCloseModal();

            setShowSuccessMessage(true);

            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 5000);
        } catch (error) {
            console.error('Error updating department:', error);
        }
    };


    const handleShowDeleteConfirmation = (departmentId) => {
        setDeletingDepartmentId(departmentId);
        setShowDeleteConfirmation(true);
    };

    const handleCloseDeleteConfirmation = () => {
        setDeletingDepartmentId(null);
        setShowDeleteConfirmation(false);
    };

    const handleDeleteDepartment = async () => {
        try {
            const deleteResponse = await axios.delete('/manager/delete_department', {
                data: { department_id: deletingDepartmentId },
            });

            if (deleteResponse.data.success) {
                // Update the state to remove the deleted department
                setDepartments((prevDepartments) =>
                    prevDepartments.filter((department) => department.department_id !== deletingDepartmentId)
                );
            } else {
                console.error('Error deleting department:', deleteResponse.data.error);
            }
        } catch (error) {
            console.error('Error deleting department:', error);
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
                                            <b>List of departments</b>
                                        </h2>
                                    </div>
                                    <div className="col-sm-3 offset-sm-1 mt-3 mb-2 text-gred">
                                        <Button variant="primary" onClick={handleShow} style={{ backgroundColor: '#5DB85C' }}>
                                            Add New Department
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
                                                <th className="text-center align-middle">Description</th>
                                                <th className="text-center align-middle">Head of department</th>
                                                <th className="text-center align-middle">Phone</th>
                                                <th className="text-center align-middle">Email</th>
                                                <th className="text-center align-middle">Address</th>
                                                <th className="text-center align-middle">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {departments.map((department) => (
                                                <tr key={department.department_id}>
                                                    <td className="text-center align-middle">{department.department_id}</td>
                                                    <td className="text-center align-middle">{department.department_name}</td>
                                                    <td className="text-center align-middle">{department.description}</td>
                                                    <td className="text-center align-middle">{department.head_of_department}</td>
                                                    <td className="text-center align-middle">{department.department_phone}</td>
                                                    <td className="text-center align-middle">{department.department_email}</td>
                                                    <td className="text-center align-middle">{department.department_address}</td>
                                                    <td className="text-center align-middle">
                                                        <a
                                                            href="#"
                                                            className="edit"
                                                            title="Edit"
                                                            data-toggle="tooltip"
                                                            onClick={() => handleShowEditModal(department.department_id)}
                                                        >
                                                            <i className="material-icons">&#xE254;</i>
                                                        </a>
                                                        <a
                                                            href="#"
                                                            className="delete"
                                                            title="Delete"
                                                            data-toggle="tooltip"
                                                            style={{ color: 'red' }}
                                                            onClick={() => handleShowDeleteConfirmation(department.department_id)}
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
                                    <Modal.Title>Add department</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group controlId="formDepartmentName">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter department's name"
                                                name="department_name"
                                                value={formData.department_name}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="formDescription">
                                            <Form.Label>Description</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter description"
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="formHeadDepartment">
                                            <Form.Label>Head of department</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter head of department"
                                                name="head_of_department"
                                                value={formData.head_of_department}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="formDepartmentPhone">
                                            <Form.Label>Phone number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter department's phone number"
                                                name="department_phone"
                                                value={formData.department_phone}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="formDepartmentEmail">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter department's email"
                                                name="department_email"
                                                value={formData.department_email}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="formDepartmentAddress">
                                            <Form.Label>Address</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter department's address"
                                                name="department_address"
                                                value={formData.department_address}
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
                                    <Modal.Title>Edit Department</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form onSubmit={handleEditSubmit}>
                                        <Form.Group controlId="formDepartmentName">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter new department's name"
                                                name="department_name"
                                                value={formData.department_name}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="formDescription">
                                            <Form.Label>Description</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter new description"
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="formHeadDepartment">
                                            <Form.Label>Head of department</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter new head of department"
                                                name="head_of_department"
                                                value={formData.head_of_department}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="formDepartmentPhone">
                                            <Form.Label>Phone number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter new department's phone number"
                                                name="department_phone"
                                                value={formData.department_phone}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="formDepartmentEmail">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter new department's email"
                                                name="department_email"
                                                value={formData.department_email}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="formDepartmentAddress">
                                            <Form.Label>Address</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter new department's address"
                                                name="department_address"
                                                value={formData.department_address}
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
                                    <p>Are you sure you want to delete this department?</p>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCloseDeleteConfirmation}>
                                        Cancel
                                    </Button>
                                    <Button variant="danger" onClick={handleDeleteDepartment}>
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

export default ManagerDepartment;