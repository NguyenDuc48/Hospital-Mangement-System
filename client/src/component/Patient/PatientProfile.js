import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header'
import PatientSidebar from './PatientSidebar'

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
        console.log('Token:', token);

        const response = await axios.get('/patient/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Server Response:', response);

        if (!response.data) {
          throw new Error('Empty response data');
        }

        console.log('Response Data:', response.data);

        setPatientData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching patient profile:', error.message);
        setError('Failed to fetch patient profile');
        setLoading(false);
      }
    };

    console.log('Fetching patient profile...');

    fetchPatientProfile();
  }, []); // Empty dependency array ensures the effect runs only once on component mount

  console.log('Rendering component with patientData:', patientData);

  return (
    <div>
      <Header/>
      <div style={{ display: 'flex', overflowY: "auto", width: "100%", flexWrap: 'wrap' }}>
          <div style={{ width: '25%' }}>
            <PatientSidebar />
          </div>
          <div style={{ height: '100vh', overflow: 'scroll initiali', width: '70%' }}>
                <h1>Patient Profile</h1>
              {loading && <p>Loading...</p>}
              {error && <p>Error: {error}</p>}
              {patientData && (
                <div>
                  <p>Full Name: {patientData[0].full_name}</p>
                  <p>Date of Birth: {new Date(patientData[0].dob).toLocaleDateString()}</p>
                  <p>Gender: {patientData[0].gender}</p>
                  <p>Phone Number: {patientData[0].phone_number}</p>
                  <p>Address: {patientData[0].address}</p>
                  <p>Email: {patientData[0].email}</p>
                  <p>Health Insurance Percent: {patientData[0].health_insurance_percent}</p>
                </div>
              )}
          </div>
      </div>

      
    </div>
  );
};

export default PatientProfile;
