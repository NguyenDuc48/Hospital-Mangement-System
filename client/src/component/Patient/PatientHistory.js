import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBTypography,
  MDBListGroup,
  MDBListGroupItem,
  MDBIcon,
} from 'mdbreact';
import Header from './Header';
import PatientSidebar from './PatientSidebar';
import jwt from 'jsonwebtoken';

const PatientHistory = () => {
  const [patientHistory, setPatientHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isValidAccess, setValidAccess] = useState(false);
  useEffect(() => {
    const decodeToken = () => {  
        const token = localStorage.getItem('token');
        if (!token) {
          setValidAccess(false)
        }
        else {
          const decoded = jwt.decode(token);
          console.log("decode day nay:", decoded)
          if (decoded.userId.substring(0,2) === "BN") 
            setValidAccess(true);
          else setValidAccess(false)
        }
    };
    decodeToken();
  },[]);
  useEffect(() => {
    const fetchPatientHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found in localStorage');
        }

        const response = await axios.get('/patient/history', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.data) {
          throw new Error('Empty response data');
        }

        setPatientHistory(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching patient history:', error.message);
        setError('Failed to fetch patient history');
        setLoading(false);
      }
    };

    fetchPatientHistory();
  }, []);
  if (isValidAccess)

  return (
    <div>
      <Header />
      <div
        style={{
          display: 'flex',
          overflowY: 'auto',
          width: '100%',
          flexWrap: 'wrap',
        //   padding: '20px',
        }}
      >
        <div style={{ width: '25%', marginBottom: '20px' }}>
          <PatientSidebar />
        </div>
        <div
          style={{
            height: '100vh',
            overflow: 'scroll',
            width: '70%',
          }}
        >
          <MDBContainer className="py-5">
            <MDBRow className="justify-content-center align-items-center">
              <MDBCol lg="12" className="mb-4 mb-lg-0">
                <MDBCard className="mb-3" style={{ borderRadius: '.5rem', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                  <MDBCardBody className="p-4">
                    <MDBTypography style={{ fontWeight: 'bold' }} tag="h4" className="text-center mb-4">
                      Patient History
                    </MDBTypography>
                    {loading && <p className="text-center">Loading...</p>}
                    {error && <p className="text-center text-danger">Error: {error}</p>}
                    {patientHistory.length === 0 && !loading && !error && (
                      <p className="text-center">No patient history available.</p>
                    )}
                    {patientHistory.length > 0 && (
                      <MDBListGroup>
                        {patientHistory.map((historyItem) => (
                          <MDBListGroupItem key={historyItem.report_id} className="mb-3">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <strong>Report ID:</strong> {historyItem.report_id}
                              </div>
                              <div className="text-muted">
                                <MDBIcon icon="calendar-alt" className="mr-2" />
                                {new Date(historyItem.appointment_date).toLocaleDateString()}
                              </div>
                            </div>
                            <div>
                              <strong>Doctor ID:</strong> {historyItem.doctor_id}
                            </div>
                            <div>
                              <strong>Diagnostic:</strong> {historyItem.diagnostic}
                            </div>
                            <div>
                              <strong>Conclusion:</strong> {historyItem.conclusion}
                            </div>
                            <div>
                              <strong>Note:</strong> {historyItem.note}
                            </div>
                            <div>
                              <strong>Money to Pay:</strong> {historyItem.money_need_to_pay} VND
                            </div>
                          </MDBListGroupItem>
                        ))}
                      </MDBListGroup>
                    )}
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </div>
      </div>
    </div>
  );
  else
  return (      
  <p
    style={{
      color: 'red',
      fontWeight: 'bold',
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
      padding: '10px',
      backgroundColor: '#ffe6e6',
      borderRadius: '5px',
    }}
  >
    Access Denied
  </p>);
};

export default PatientHistory;
