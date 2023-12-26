import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientProfile = () => {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found in localStorage');
        }

        const response = await axios.get('/patient/profile', {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Server Response:', response);

        if (!response.data) {
          throw new Error('Empty response data');
        }

        setPatientData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching patient profile:', error.message);
        setError('Failed to fetch patient profile');
        setLoading(false);
      }
    };

    fetchPatientProfile();
  }, []); // Empty dependency array ensures the effect runs only once on component mount

  return (
    <div>
      <h1>Patient Profile</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {patientData && (
        <div>
          <p>Full Name: {patientData.full_name}</p>
          <p>Date of Birth: {new Date(patientData.dob).toLocaleDateString()}</p>
          <p>Gender: {patientData.gender}</p>
          <p>Phone Number: {patientData.phone_number}</p>
          <p>Address: {patientData.address}</p>
          <p>Email: {patientData.email}</p>
          <p>Health Insurance Percent: {patientData.health_insurance_percent}</p>
        </div>
      )}
    </div>
  );
};

export default PatientProfile;
