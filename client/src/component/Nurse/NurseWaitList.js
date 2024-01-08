import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import NurseSidebar from './NurseSidebar';
import { Button } from 'react-bootstrap';
// import './NurseWaitingList.css'

const NurseWaitList = () => {
  const [waitingList, setWaitingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeRows, setActiveRows] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/nurse/waiting_list');

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
    // Add any logic you need when a patient's full name is clicked
  };
  console.log(waitingList)

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
                          {/* <th className="text-center toggle-btn-th">
                            <div className="toggle-btn">
                              <div className="inner-circle"></div>
                            </div>
                          </th> */}
                          <th>Wait ID</th>
                          <th>Full name</th>
                          <th>Department Name</th>
                          <th>Description</th>
                          <th>Priority</th>
                          <th>Payment</th>
                          
                        </tr>
                      </thead>
                      <tbody className="table-body">
                        {loading ? (
                          <tr>
                            <td colSpan="5" className="text-center">
                              Loading...
                            </td>
                          </tr>
                        ) : error ? (
                          <tr>
                            <td colSpan="5" className="text-center text-danger">
                              Error: {error}
                            </td>
                          </tr>
                        ) : waitingList.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="text-center">
                              No data available.
                            </td>
                          </tr>
                        ) : (
                          waitingList.map((item, index) => (
                            <tr key={item.wait_id} className="cell-1">
                              {/* <td className="text-center">
                                <div
                                  className={`toggle-btn ${activeRows[index] ? 'active' : ''}`}
                                  onClick={() => handleToggle(index)}
                                >
                                  <div className="inner-circle"></div>
                                </div>
                              </td> */}
                              <td>{item.wait_id}</td>
                              <td>
                                <span
                                  className="full-name-link"
                                  onClick={() => handleFullNameClick(item)}
                                >
                                  {item.full_name}
                                </span>
                              </td>
                              <td>{item.department_name}</td>
                              <td>{item.description}</td>
                              <td>
                                {item.priority === 'yes' ? (
                                  <span className="badge badge-success">Yes</span>
                                ) : (
                                  <span className="badge badge-info">No</span>
                                )}
                              </td>
                                <td>
                                    <Button style={{backgroundColor: "#ce7354", padding: "2px 10px", fontSize :"14px"}} >
                                    Report
                                    </Button>
                                </td>
                            </tr>
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

export default NurseWaitList;
