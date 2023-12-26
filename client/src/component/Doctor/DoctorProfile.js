import React from 'react';
import Header from './Header';
import DoctorSidebar from './DoctorSidebar';
const DoctorProfile = () => {
  return (
    <div>
    <Header />
    <div style={{ display: 'flex', overflowY: "auto", width: "100%", flexWrap: 'wrap' }}>
        <div style={{ width: '25%' }}>
          <DoctorSidebar />
        </div>
        <div style={{ height: '100vh', overflow: 'scroll initiali', width: '70%' }}>
          <h1>Doctor Profile</h1>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
