import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import DoctorSidebar from './DoctorSidebar';
import './DoctorWaitingList.css';
import { Button } from 'react-bootstrap';

const DoctorWaitingList = () => {
  const [waitingList, setWaitingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeRows, setActiveRows] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medicalActive, setMedicalActive] = useState(false)
  const [showMedicalReportButton, setShowMedicalReportButton] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      const response = await axios.get('/doctor/waiting_list', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setWaitingList(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching waiting list:', error.message);
      setError('Failed to fetch waiting list');
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found in localStorage');
        }

        const response = await axios.get('/doctor/waiting_list', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setWaitingList(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching waiting list:', error.message);
        setError('Failed to fetch waiting list');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFullNameClick = (patient) => {
    setSelectedPatient(patient);
  };
  const handleWaitingButtonClick = async (waitId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }
      await axios.put(
        `/doctor/call_patient`,
        { wait_id: waitId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
    fetchData();
    } catch (error) {
      console.error('Error calling patient:', error.message);
    }
  };

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
        <div style={{ width: '25%' }}>
          <DoctorSidebar />
        </div>
        <div
          style={{
            height: '100vh',
            overflow: 'scroll initial',
            width: '70%',
          }}
        >
          <div className="container mt-5">
            <div className="d-flex justify-content-center row">
              <div className="col-md-10">
                <div className="rounded">
                  <div className="table-responsive table-borderless">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Wait ID</th>
                          <th>Full name</th>
                          <th>Priority</th>
                          <th>Status</th>
                          <th>Medical Report</th>

                        </tr>
                      </thead>
                      <tbody className="table-body">
                        {loading ? (
                          <tr>
                            <td colSpan="4" className="text-center">Loading...</td>
                          </tr>
                        ) : error ? (
                          <tr>
                            <td colSpan="4" className="text-center text-danger">Error: {error}</td>
                          </tr>
                        ) : waitingList.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="text-center">No data available.</td>
                          </tr>
                        ) : (
                          waitingList.map((innerArray, index) => (
                            <React.Fragment key={index}>
                              {innerArray.length > 0 ? (
                                innerArray.map((item, innerIndex) => (
                                  <tr key={innerIndex} className="cell-1">
                                    <td>{item.wait_id}</td>

                                    <td>
                                      <span
                                        className="full-name-link"
                                        onClick={() => handleFullNameClick(item)}
                                      >
                                        {item.full_name}
                                      </span>
                                    </td>
                                    <td>
                                      {item.priority === 'yes' ? (
                                        <span className="badge badge-success">Yes</span>
                                      ) : (
                                        <span className="badge badge-info">No</span>
                                      )}
                                    </td>
                                    <td>

                                      {
                                        item.status === 'waiting' ? (
                                          <Button 
                                            onClick={() => handleWaitingButtonClick(item.wait_id)}
                                            variant='primary'
                                            
                                          >
                                            {item.status}
                                          </Button>

                                        ) : (
                                          <Button 
                                          onClick={() => handleWaitingButtonClick(item.wait_id)}
                                          variant='secondary'
                                          
                                        >
                                          {item.status}
                                        </Button>

                                        )
                                      }
                                    </td>
                                    <td>
                                      {item.status === 'in progress' && (
                                        <Button>Add Medical Report</Button>
                                      )}
                                    </td>
                                  
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  {/* <td colSpan="5" className="text-center">
                                    No data available.
                                  </td> */}
                                </tr>
                              )}
                            </React.Fragment>
                          ))
                          
                          
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorWaitingList;
