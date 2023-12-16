// UpdateForm.js
import React, { useState } from 'react';
import './UpdateForm.css'; // Import the CSS file

const UpdateForm = ({ onUpdate }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    address: '',
    email: '',
    phone_no: '',
    disease: '',
  });

  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = () => {
    // Basic validation example (you may want to enhance this based on your requirements)
    if (!formData.email || !formData.first_name) {
      // Display an error message to the user
      alert('Please provide both first name and email.');
      return;
    }

    // Perform the update
    onUpdate(formData);

    // Display a success message
    setSuccessMessage('Patient information updated successfully!');
  };

  return (
    <div className="update-form">
      <h2 className="text-primary">Update Information</h2>
      <div>
        <label>First Name:</label>
        <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} />
      </div>
      <div>
        <label>Last Name:</label>
        <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} />
      </div>
      <div>
        <label>Address:</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} />
      </div>
      <div>
        <label>Phone Number:</label>
        <input type="tel" name="phone_no" value={formData.phone_no} onChange={handleChange} />
      </div>
      <div>
        <label>Disease:</label>
        <input type="text" name="disease" value={formData.disease} onChange={handleChange} />
      </div>
      <button onClick={handleUpdate}>Update Information</button>

      {successMessage && <p className="text-success">{successMessage}</p>}
    </div>
  );
};

export default UpdateForm;
