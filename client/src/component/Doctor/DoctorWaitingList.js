import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import DoctorSidebar from './DoctorSidebar';
import './DoctorWaitingList.css';
import { Button, Form, Modal, Dropdown } from 'react-bootstrap';

const DoctorWaitingList = () => {

  const [waitingList, setWaitingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeRows, setActiveRows] = useState([]);
  // const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState({});

  const [medicalActive, setMedicalActive] = useState(false)
  const [showMedicalReportButton, setShowMedicalReportButton] = useState(false);
  const [diagnostic, setDiagnostic] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [note, setNote] = useState('');
  const [showMedicalReportModal, setShowMedicalReportModal] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [drugs, setDrugs] = useState([]);
  const [selectedDrug, setSelectedDrug] = useState(null);
  // const [quantity, setQuantity] = useState('');
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [quantity, setQuantity] = useState('');

  const handleMedicalReportModal = () => {
    setShowMedicalReportModal(!showMedicalReportModal);
  };
  const handleMedicalReportSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      const response = await axios.post(
        `/doctor/create_report/${selectedPatient.patient_id}`,
        {
          diagnostic,
          conclusion,
          note,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Handle success, close modal, or update state as needed
      console.log('Medical report created:', response.data);
      setShowMedicalReportModal(false);
      fetchData(); // Fetch data again to update the waiting list
    } catch (error) {
      console.error('Error creating medical report:', error.message);
      // Handle error as needed
    }
  };

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

  useEffect(() => {
    // Set the first patient as selectedPatient when waitingList changes
    if (waitingList.length > 0) {
      setSelectedPatient(waitingList[0][0] || {});
    }
  }, [waitingList]);

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

  const fetchDrugs = async () => {
    try {
      const response = await axios.get('/doctor/get_drugs');
      setDrugs(response.data);
    } catch (error) {
      console.error('Error fetching drugs:', error.message);
    }
  };
  useEffect(() => {
    fetchDrugs();
  }, []);
    
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/doctor/get_services');
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error.message);
        // Handle error as needed
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        const response = await axios.get('/doctor/get_drugs');
        setDrugs(response.data);
      } catch (error) {
        console.error('Error fetching drugs:', error.message);
      }
    };
  
    fetchDrugs();
  }, []);
  

  // console.log("Patient", selectedPatient)
  // console.log("Waiting", waitingList)

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
            textAlign: "center"
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
                                            // variant='primary'
                                            className='status-waiting'
                                            
                                          >
                                            {item.status}
                                          </Button>

                                        ) : (
                                          <Button 
                                          onClick={() => handleWaitingButtonClick(item.wait_id)}
                                          // variant='secondary'
                                          className='status-in-progress'
                                        >
                                          {item.status}
                                        </Button>

                                        )
                                      }
                                    </td>
                                    <td>
                                      
                                      {item.status === 'in progress' && (
                                        <Button className = "add-report" onClick={handleMedicalReportModal}>Add Report</Button>
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
            {/* Medical Report Modal */}
      <Modal show={showMedicalReportModal} onHide={handleMedicalReportModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Medical Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="diagnostic">
              <Form.Label>Diagnostic</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter diagnostic"
                value={diagnostic}
                onChange={(e) => setDiagnostic(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="conclusion">
              <Form.Label>Conclusion</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter conclusion"
                value={conclusion}
                onChange={(e) => setConclusion(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="note">
              <Form.Label>Note</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="service">
              <Form.Label>Service</Form.Label>
              <Dropdown onSelect={(eventKey) => setSelectedService(eventKey)}>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {selectedService ? selectedService.service_name : 'Select Service'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {services.map((service) => (
                    <Dropdown.Item key={service.service_id} eventKey={service}>
                      {service.service_name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>

      
<Form.Group controlId="drug">
  <Form.Label>Drug</Form.Label>
  <Dropdown onSelect={(eventKey) => {
      const selectedDrug = drugs.find(drug => drug.drug_id === parseInt(eventKey, 10));
      setSelectedDrugs([...selectedDrugs, { ...selectedDrug, quantity }]);
      setQuantity('');
    }}
  >
    <Dropdown.Toggle variant="success" id="dropdown-drug">
      {selectedDrugs.length > 0 ? 'Drugs Selected' : 'Select Drug'}
    </Dropdown.Toggle>
    <Dropdown.Menu>
      {drugs.map((drug) => (
        <Dropdown.Item key={drug.drug_id} eventKey={drug.drug_id}>
          {drug.drug_name}
        </Dropdown.Item>
      ))}
    </Dropdown.Menu>
  </Dropdown>
</Form.Group>

{selectedDrugs.length > 0 && (
  <>
    {selectedDrugs.map((selectedDrug, index) => (
      <div key={index}>
        <p>Selected Drug: {selectedDrug.drug_name}</p>
        <Form.Group controlId={`quantity-${index}`}>
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter quantity"
            value={selectedDrug.quantity}
            onChange={(e) => {
              const updatedDrugs = [...selectedDrugs];
              updatedDrugs[index].quantity = e.target.value;
              setSelectedDrugs(updatedDrugs);
            }}
          />
        </Form.Group>

        {/* Add any other display logic for the selected drug */}
      </div>
    ))}

    {/* Add any other input fields related to the selected drug here */}
  </>
)}

           








          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleMedicalReportModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleMedicalReportSubmit}>
            Save Medical Report
          </Button>
        </Modal.Footer>
      </Modal>
        </div>
      </div>
    </div>
    
  );
};

export default DoctorWaitingList;
