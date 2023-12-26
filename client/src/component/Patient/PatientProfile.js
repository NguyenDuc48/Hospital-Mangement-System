// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import Header from './Header'
// // import PatientSidebar from './PatientSidebar'

// // const PatientProfile = () => {
// //   const [patientData, setPatientData] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     const fetchPatientProfile = async () => {
// //       try {
// //         const token = localStorage.getItem('token');
// //         if (!token) {
// //           throw new Error('Token not found in localStorage');
// //         }
// //         console.log('Token:', token);

// //         const response = await axios.get('/patient/profile', {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             'Content-Type': 'application/json',
// //           },
// //         });

// //         console.log('Server Response:', response);

// //         if (!response.data) {
// //           throw new Error('Empty response data');
// //         }

// //         console.log('Response Data:', response.data);

// //         setPatientData(response.data);
// //         setLoading(false);
// //       } catch (error) {
// //         console.error('Error fetching patient profile:', error.message);
// //         setError('Failed to fetch patient profile');
// //         setLoading(false);
// //       }
// //     };

// //     console.log('Fetching patient profile...');

// //     fetchPatientProfile();
// //   }, []); // Empty dependency array ensures the effect runs only once on component mount

// //   console.log('Rendering component with patientData:', patientData);

// //   return (
// //     <div>
// //       <Header/>
// //       <div style={{ display: 'flex', overflowY: "auto", width: "100%", flexWrap: 'wrap' }}>
// //           <div style={{ width: '25%' }}>
// //             <PatientSidebar />
// //           </div>
// //           <div style={{ height: '100vh', overflow: 'scroll initiali', width: '70%' }}>
// //                 <h1>Patient Profile</h1>
// //               {loading && <p>Loading...</p>}
// //               {error && <p>Error: {error}</p>}
// //               {patientData && (
// //                 <div>
// //                   <p>Full Name: {patientData[0].full_name}</p>
// //                   <p>Date of Birth: {new Date(patientData[0].dob).toLocaleDateString()}</p>
// //                   <p>Gender: {patientData[0].gender}</p>
// //                   <p>Phone Number: {patientData[0].phone_number}</p>
// //                   <p>Address: {patientData[0].address}</p>
// //                   <p>Email: {patientData[0].email}</p>
// //                   <p>Health Insurance Percent: {patientData[0].health_insurance_percent}</p>
// //                 </div>
// //               )}
// //           </div>
// //       </div>

      
// //     </div>
// //   );
// // };

// // export default PatientProfile;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   MDBContainer,
//   MDBRow,
//   MDBCol,
//   MDBCard,
//   MDBCardImage,
//   MDBCardBody,
//   MDBCardText,
//   MDBTypography,
//   MDBIcon,
// } from 'mdbreact';
// import Header from './Header';
// import PatientSidebar from './PatientSidebar';

// const PatientProfile = () => {
//   const [patientData, setPatientData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchPatientProfile = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           throw new Error('Token not found in localStorage');
//         }

//         const response = await axios.get('/patient/profile', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!response.data) {
//           throw new Error('Empty response data');
//         }

//         setPatientData(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching patient profile:', error.message);
//         setError('Failed to fetch patient profile');
//         setLoading(false);
//       }
//     };

//     fetchPatientProfile();
//   }, []);

//   return (
//     <div>
//       <Header />
//       <div
//         style={{ display: 'flex', overflowY: 'auto', width: '100%', flexWrap: 'wrap',}}>
//         <div style={{ width: '25%' }}>
//           <PatientSidebar />
//         </div>
//         <div
//           style={{
//             height: '100vh',
//             overflow: 'scroll initiali',
//             width: '70%',
//           }}
//          >
//       <MDBContainer className="py-5">
//           <MDBRow className="justify-content-center align-items-center">
//             <MDBCol lg="6" className="mb-4 mb-lg-0">
//               <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
//                 <MDBRow className="g-0">
//                   <MDBCol md="4" className="gradient-custom text-center text-white" style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
//                     <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp" alt="Avatar" className="my-5" style={{ width: '80px' }} fluid />
//                     <MDBTypography tag="h5">{patientData?.full_name}</MDBTypography>
//                     <MDBCardText>Patient</MDBCardText>
//                     <MDBIcon far icon="edit mb-5" />
//                   </MDBCol>
//                   <MDBCol md="8">
//                     <MDBCardBody className="p-4">
//                       <MDBTypography tag="h6">Information</MDBTypography>
//                       <hr className="mt-0 mb-4" />
//                       <MDBRow className="pt-1">
//                         <MDBCol size="6" className="mb-3">
//                           <MDBTypography tag="h6">Email</MDBTypography>
//                           <MDBCardText className="text-muted">{patientData?.email}</MDBCardText>
//                         </MDBCol>
//                         <MDBCol size="6" className="mb-3">
//                           <MDBTypography tag="h6">Phone</MDBTypography>
//                           <MDBCardText className="text-muted">{patientData?.phone_number}</MDBCardText>
//                         </MDBCol>
//                       </MDBRow>

//                       {/* Add additional patient information here */}

//                       <div className="d-flex justify-content-start">
//                         {/* Add social media icons or links here */}
//                       </div>
//                     </MDBCardBody>
//                   </MDBCol>
//                 </MDBRow>
//               </MDBCard>
//             </MDBCol>
//           </MDBRow>
//       </MDBContainer>
        

//         </div>
//       </div>

//     </div>
//   );
// };

// export default PatientProfile;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardImage,
  MDBCardBody,
  MDBCardText,
  MDBTypography,
  MDBIcon,
} from 'mdbreact';
import Header from './Header';
import PatientSidebar from './PatientSidebar';

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

        const response = await axios.get('/patient/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.data) {
          throw new Error('Empty response data');
        }

        setPatientData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching patient profile:', error.message);
        setError('Failed to fetch patient profile');
        setLoading(false);
      }
    };

    fetchPatientProfile();
  }, []); 
  console.log('Rendering component with patientData:', patientData);
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
          <PatientSidebar />
        </div>
        <div
          style={{
            height: '100vh',
            overflow: 'scroll initiali',
            width: '70%',
          }}
        >
          <MDBContainer className="py-5">
            <MDBRow className="justify-content-center align-items-center">
              <MDBCol lg="20" className="mb-4 mb-lg-0">
                {patientData && (
                  <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
                    <MDBRow className="g-0">
                      <MDBCol
                        md="4"
                        className="gradient-custom text-center text-black"
                        style={{
                          borderTopLeftRadius: '.5rem',
                          borderBottomLeftRadius: '.5rem',
                          backgroundColor: '#F9BE72', 
                        }}
                      >
                        <MDBCardImage
                          src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                          alt="Avatar"
                          className="my-5"
                          style={{ width: '80px' }}
                          fluid
                        />
                        <MDBTypography tag="h5">
                          {patientData[0].full_name}
                        </MDBTypography>
                        <MDBCardText>Patient</MDBCardText>
                        <MDBIcon far icon="edit mb-5" />
                      </MDBCol>
                      <MDBCol md="8">
                        <MDBCardBody className="p-4">
                          <MDBTypography style={{fontWeight: "bold"}}  tag="h4">INFORMATION</MDBTypography>
                          <hr style={{borderTop:"2px solid black"}} className="mt-0 mb-4" />
                          <MDBRow className="pt-1">
                          <MDBCol size="6" className="mb-3">
                              <MDBTypography tag="h6" style={{fontWeight: "bold"}}>ID</MDBTypography>
                              <MDBCardText className="text-muted">
                                {patientData[0].patient_id}
                              </MDBCardText>
                            </MDBCol>
                            <MDBCol size="6"  className="mb-3">
                              <MDBTypography tag="h6" style={{fontWeight: "bold"}}>Full Name</MDBTypography>
                              <MDBCardText className="text-muted">
                                {patientData[0].full_name}
                              </MDBCardText>
                            </MDBCol>


                            <MDBCol size="6"  className="mb-3">
                              <MDBTypography style={{fontWeight: "bold"}} tag="h6">Email</MDBTypography>
                              <MDBCardText className="text-muted">
                                {patientData[0].email}
                              </MDBCardText>
                            </MDBCol>
                            <MDBCol size="6" className="mb-3">
                              <MDBTypography style={{fontWeight: "bold"}} tag="h6">Phone</MDBTypography>
                              <MDBCardText className="text-muted">
                                {patientData[0].phone_number}
                              </MDBCardText>
                            </MDBCol>
                            <MDBCol size="6" className="mb-3">
                              <MDBTypography style={{fontWeight: "bold"}} tag="h6">Address</MDBTypography>
                              <MDBCardText className="text-muted">
                                {patientData[0].address}
                              </MDBCardText>
                            </MDBCol>
                            <MDBCol size="6" className="mb-3">
                              <MDBTypography  style={{fontWeight: "bold"}} tag="h6">Date of Birth</MDBTypography>
                              <MDBCardText className="text-muted">
                                {new Date(patientData[0].dob).toLocaleDateString()}
                              </MDBCardText>
                            </MDBCol>
                            <MDBCol size="6" className="mb-3">
                              <MDBTypography style={{fontWeight: "bold"}} tag="h6">Health Insurance Percent</MDBTypography>
                              <MDBCardText className="text-muted">
                                {patientData[0].health_insurance_percent}
                              </MDBCardText>
                            </MDBCol>
                            

                            













                          </MDBRow>
                          <div className="d-flex justify-content-start">
                            {/* Add social media icons or links here */}
                          </div>
                        </MDBCardBody>
                      </MDBCol>
                    </MDBRow>
                  </MDBCard>
                )}
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
