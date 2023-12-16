import React, { useState, useEffect } from 'react';
import Navber from './PatientNavbar';
import Footer from '../Footer';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import UpdateForm from './UpdateForm';

import doc_img from './doctor1.jpg';
import LoadingSpinner from './LoadingSpinner'; // Import the LoadingSpinner component

var patient_id;
const PatientInformation = ({ patientDetails }) => (
  <div className="container ml-3">
    <div className="jumbotron mt-5" style={{ backgroundColor: '#98D9E3' }}>
      <h2 className="text-primary">Patient Information</h2>
      <br />
      <table className="table col-md-6">
        <tbody>
          <tr>
            <td>Name</td>
            <td>
              {patientDetails.first_name} {patientDetails.last_name}
            </td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{patientDetails.email}</td>
          </tr>
          <tr>
            <td>Address</td>
            <td>{patientDetails.address}</td>
          </tr>
          <tr>
            <td>Phone number</td>
            <td>{patientDetails.phone_no}</td>
          </tr>
          <tr>
            <td>Disease</td>
            <td>{patientDetails.disease}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);


const DoctorInformation = ({ doctorDetails }) => (
  <div className="col">
    <br />
    <br />
    <div className="card card-cascade narrower mr-3" style={{ backgroundColor: '#98D9E3' }}>
      <h2 className="text-primary card-body card-body-cascade text-center mt-3  ">Doctor Information</h2>
      <Image width={520} height={760} className="img-responsive center-block my-5" src={doc_img} thumbnail />
      <div className="card-body card-body-cascade text-center">
        <h4 className="card-title">
          <strong>
            {doctorDetails.doctor_firstname} {doctorDetails.doctor_lastname}{' '}
          </strong>
        </h4>
        <h5 className="blue-text pb-2">
          <strong>{doctorDetails.specialist}</strong>
        </h5>
        <p className="card-text">The doctor currently assigned to the patient</p>
      </div>
    </div>
  </div>
);

const BillInformation = ({ billDetails }) => (
  <div className="container ml-3">
    <div className="jumbotron mt-5" style={{ backgroundColor: '#98D9E3' }}>
      <h2 className="text-primary">Patient Bill</h2>
      <br />
      <table className="table col-md-6">
        <tbody>
          <tr>
            <td>Medicine Cost</td>
            <td>{billDetails.medicine_cost}</td>
          </tr>
          <tr>
            <td>Operation Charge</td>
            <td>{billDetails.operation_charge}</td>
          </tr>
          <tr>
            <td>Room Charge</td>
            <td>{billDetails.room_charge}</td>
          </tr>
          <tr>
            <td>Miscellaneous Charge</td>
            <td>{billDetails.misc_charge}</td>
          </tr>
          <tr>
            <td>Total</td>
            <td>
              {billDetails.misc_charge + billDetails.room_charge + billDetails.operation_charge + billDetails.medicine_cost}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);
const PatientHome = () => {


  const [activeSection, setActiveSection] = useState('patient');
  const [patientDetails, setPatientDetails] = useState({
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    phone_no: '',
    disease: '',
  });

  const [doctorDetails, setDoctorDetails] = useState({
    doctor_firstname: '',
    doctor_lastname: '',
    specialist: '',
  });

  const [billDetails, setBillDetails] = useState({
    medicine_cost: '',
    misc_charge: '',
    room_charge: '',
    operation_charge: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await axios.get('/patient/details', {
          headers: {
            authorization: sessionStorage.getItem('usertoken'),
          },
        });
        const details = response.data[0];
        patient_id = details.patient_id;
        setPatientDetails({
          first_name: details.first_name,
          last_name: details.last_name,
          address: details.address,
          email: details.email,
          phone_no: details.phone_no,
          disease: details.disease,
        });
      } catch (error) {
        console.error('Error fetching patient details:', error);
      }
    };

    const fetchDoctorDetails = async () => {
      try {
        const response = await axios.get('/patient/doctor', {
          headers: {
            authorization: sessionStorage.getItem('usertoken'),
          },
        });
        if (response.data.length !== 0) {
          const details = response.data[0];
          setDoctorDetails({
            doctor_firstname: details.doctor_firstname,
            doctor_lastname: details.doctor_lastname,
            specialist: details.specialisation,
          });
        } else {
          setDoctorDetails({
            doctor_firstname: 'No Doctor Assigned',
          });
        }
      } catch (error) {
        console.error('Error fetching doctor details:', error);
      }
    };

    const fetchBillDetails = async () => {
      try {
        const response = await axios.get('/patient/bill', {
          headers: {
            authorization: sessionStorage.getItem('usertoken'),
          },
        });
        setBillDetails({
          medicine_cost: response.data[0].medicine_cost,
          misc_charge: response.data[0].misc_charge,
          room_charge: response.data[0].room_charge,
          operation_charge: response.data[0].operation_charge,
        });
      } catch (error) {
        console.error('Error fetching bill details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetails();
    fetchDoctorDetails();
    fetchBillDetails();
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'patient':
        return <PatientInformation patientDetails={patientDetails} />;
      case 'doctor':
        return <DoctorInformation doctorDetails={doctorDetails} />;
      case 'bill':
        return <BillInformation billDetails={billDetails} />;
        case 'update':
          return <UpdateForm onUpdate={handleUpdatePatient} />;
      default:
        return null;
    }
  };
  const handleUpdatePatient = async ({      first_name,
  last_name,
  address,
  email,
  phone_no,
  disease}) => {
    try {
      // Perform the update request using axios or your preferred method
      const response = await axios.put('/patient/update', {
        patient_id,
        first_name,
        last_name,
        address,
        email,
        phone_no,
        disease
      });
  
      // Handle success, update state or show a success message
      console.log('Patient information updated successfully:', response.data);
    } catch (error) {
      // Handle error, show an error message
      console.error('Error updating patient information:', error);
    }
  };
  return (
    <div className="bg-dark">
      <Navber />
      <div className="container-fluid">
        <Row>
          <Col md={3}>
            <div className="nav flex-column nav-pills">
              <button
                className={`nav-link ${activeSection === 'patient' ? 'active' : ''}`}
                onClick={() => setActiveSection('patient')

              }        
              >
                Patient Information
              </button>
              <button
                className={`nav-link ${activeSection === 'doctor' ? 'active' : ''}`}
                onClick={() => setActiveSection('doctor')
                
              }
              >
                Doctor Information
              </button>
              <button
                className={`nav-link ${activeSection === 'bill' ? 'active' : ''}`}
                onClick={() => setActiveSection('bill')
   
              }
              >
                Bill
              </button>

              <button
      className={`nav-link ${activeSection === 'update' ? 'active' : ''}`}
      onClick={() => setActiveSection('update')}
    >
      Update Information
    </button>
            </div>
          </Col>
          <Col md={9}>
            {loading ? <LoadingSpinner /> : renderSection()}
          </Col>
        </Row>
      </div>
      <Footer />
    </div>
  );
};

export default PatientHome;