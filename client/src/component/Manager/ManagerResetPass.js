// ManagerResetPass.js
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import Headers from '../Manager/Header';
import ManagerSidebar from './ManagerSidebar';
import { ToastContainer, toast } from 'react-toastify';
// import { response } from 'express';
import 'react-toastify/dist/ReactToastify.css';

const ManagerResetPass = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        try {
            // Assuming you have an API endpoint for resetting the password
            const response = await axios.post('/manager/reset_password', formData);

            console.log(response.data);

            // Add any additional logic based on the API response if needed

            // Clear the form after successful password reset
            setFormData({
                username: '',
                password: '',
            });
            toast.success('Changed password successfully!', {
                position: 'bottom-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
        } catch (error) {
            console.error('Error resetting password:', error);
            toast.error('Not found username!', {
                position: 'bottom-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
        }
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
        <Container>
            <Row className="justify-content-md-center mt-5">
                <Col md={6}>
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Reset Password</h2>
                            <Form onSubmit={handleResetPassword}>
                                <Form.Group controlId="formUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group controlId="formPassword">
                                    <Form.Label>New Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter your new password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" block>
                                    Reset Password
                                </Button>
                            </Form>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
</div>
        </div>
        </div>


            
        
    );
};

export default ManagerResetPass;