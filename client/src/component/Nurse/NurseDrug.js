import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import NurseSidebar from './NurseSidebar';
import { InputGroup, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const NurseDrug = () => {
  const [drugList, setDrugList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  const fetchAllDrugs = async () => {
    try {
      const response = await axios.get('/nurse/all_drug');

      if (!response.data) {
        throw new Error('Empty response data');
      }

      setDrugList(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching all drugs:', error.message);
      setError('Failed to fetch drug list');
      setLoading(false);
    }
  };

  const searchDrugs = async () => {
    try {
      const response = await axios.get(`/nurse/all_drug/search/${encodeURIComponent(searchInput)}`);

      if (!response.data) {
        throw new Error('Empty response data');
      }

      setDrugList(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error searching drugs:', error.message);
      setError('Failed to search drugs');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchInput) {
      searchDrugs(searchInput);
    } else {
      fetchAllDrugs();
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
                placeholder="Search by drug name or origin..."
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
                    <th>Dosage</th>
                    <th>Price</th>
                    <th>Origin</th>
                    <th>Quantity Left</th>
                  </tr>
                </thead>
                <tbody>
                  {drugList.map((drug, index) => (
                    <tr key={drug.drug_id} className={index % 2 === 0 ? 'table-light' : 'table-white'}>
                      <td>{drug.drug_id}</td>
                      <td>{drug.drug_name}</td>
                      <td>{drug.dosage}</td>
                      <td>{drug.price}</td>
                      <td>{drug.origin}</td>
                      <td>{drug.quantity_left}</td>
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

export default NurseDrug;
