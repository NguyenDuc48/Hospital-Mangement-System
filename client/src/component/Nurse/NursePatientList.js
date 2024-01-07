import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import NurseSidebar from './NurseSidebar';

const NursePatientList = () => {
  const [patientList, setPatientList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  const fetchAllPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      const response = await axios.get('/nurse/all_patient', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.data) {
        throw new Error('Empty response data');
      }

      setPatientList(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching all patients:', error.message);
      setError('Failed to fetch patient list');
      setLoading(false);
    }
  };

  const searchPatients = async () => {
    try {
        const response = await axios.get(`/nurse/all_patient/search/${encodeURIComponent(searchInput)}`);

        if (!response.data) {
            throw new Error('Empty response data');
        }

        setPatientList(response.data);
        setLoading(false);
    } catch (error) {
        console.error('Error searching patients:', error.message);
        setError('Failed to search patients');
        setLoading(false);
    }
};


  const handleSearch = () => {
    searchPatients();
  };

  useEffect(() => {
    if (!searchInput) {
      fetchAllPatients();
    }
  }, [searchInput]);

  return (
    <div>
      <Header />
      <div
        style={{
          display: 'flex',
          overflowY: 'auto',
          width: '100%',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ width: '25%', marginBottom: '20px' }}>
          <NurseSidebar />
        </div>
        <div
          style={{
            height: '100vh',
            overflow: 'scroll',
            width: '70%',
          }}
        >
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Search by telephone..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <table
              className="table table-bordered table-striped"
              style={{
                marginTop: '20px',
              }}
            >
              <thead className="thead-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Date of Birth</th>
                  <th>Gender</th>
                  <th>Phone Number</th>
                  <th>Address</th>
                  <th>Email</th>
                  <th>Health Insurance Percent</th>
                </tr>
              </thead>
              <tbody>
                {patientList.map((patient, index) => (
                  <tr key={patient.patient_id} className={index % 2 === 0 ? 'table-light' : 'table-white'}>
                    <td>{patient.patient_id}</td>
                    <td>{patient.full_name}</td>
                    <td>{new Date(patient.dob).toLocaleDateString()}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.phone_number}</td>
                    <td>{patient.address}</td>
                    <td>{patient.email}</td>
                    <td>{`${patient.health_insurance_percent}%`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default NursePatientList;
