import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import NurseSidebar from './NurseSidebar';
import { Button, InputGroup, FormControl, Modal, Form, Toast } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const NurseEquipment = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const fetchAllEquipment = async () => {
    try {
      const response = await axios.get('/nurse/all_equipment');

      if (!response.data) {
        throw new Error('Empty response data');
      }

      setEquipmentList(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching all equipment:', error.message);
      setError('Failed to fetch equipment list');
      setLoading(false);
    }
  };

  const searchEquipment = async () => {
    try {
      const response = await axios.get(`/nurse/all_equipment/search/${encodeURIComponent(searchInput)}`);

      if (!response.data) {
        throw new Error('Empty response data');
      }

      setEquipmentList(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error searching equipment:', error.message);
      setError('Failed to search equipment');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchInput) {
      searchEquipment(searchInput);
    } else {
      fetchAllEquipment();
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
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'scroll',
            width: '70%',
            padding: '20px',
          }}
        >
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <InputGroup className="" style={{ width: '50%' }}>
              <FormControl
                placeholder="Search by equipment name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </InputGroup>
            
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <>
              <table className="table table-bordered table-striped">
                <thead className="thead-light">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Quantity Left</th>
                    <th>Fee per Day</th>
                  </tr>
                </thead>
                <tbody>
                  {equipmentList.map((equipment, index) => (
                    <tr key={equipment.equipment_id} className={index % 2 === 0 ? 'table-light' : 'table-white'}>
                      <td>{equipment.equipment_id}</td>
                      <td>{equipment.name}</td>
                      <td>{equipment.status}</td>
                      <td>{equipment.quantity_left}</td>
                      <td>{equipment.fee_per_day}</td>
                     
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NurseEquipment;
