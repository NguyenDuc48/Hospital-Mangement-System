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
  const [isToggleActive, setIsToggleActive] = useState(false);
  const [activeRows, setActiveRows] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
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

        // if (!response.data) {
        //   throw new Error('Empty response data');
        // }

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

  const handleToggle = (index) => {
    setActiveRows((prevActiveRows) => {
      const newActiveRows = [...prevActiveRows];
      newActiveRows[index] = !newActiveRows[index];
      return newActiveRows;
    });
  };
  const handleFullNameClick = (patient) => {
    setSelectedPatient(patient);
  };

  console.log("WaitingList", waitingList);

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
                        <th className="text-center toggle-btn-th">
                            <div className="toggle-btn">
                              <div className="inner-circle"></div>
                            </div>
                          </th>
                          <th>Wait ID</th>
                          <th>Full name</th>
                          <th>Priority</th>
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
                                    <td className="text-center">
                                      <div
                                        className={`toggle-btn ${activeRows[index] ? 'active' : ''}`}
                                        onClick={() => handleToggle(index)}
                                      >
                                        <div className="inner-circle"></div>
                                      </div>
                                    </td>
                                    <td>{/* Add your logic for wait_id here */}</td>
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
                                      <Button>Add Medical Report</Button>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                // Handle the case when the inner array is empty
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
