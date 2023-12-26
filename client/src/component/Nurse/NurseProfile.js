import React from 'react';
import Header from './Header';
import NurseSidebar from './NurseSidebar';
const NurseProfile = () => {
  return (
    <div>
    <Header />
    <div style={{ display: 'flex', overflowY: "auto", width: "100%", flexWrap: 'wrap' }}>
        <div style={{ width: '25%' }}>
          <NurseSidebar />
        </div>
        <div style={{ height: '100vh', overflow: 'scroll initiali', width: '70%' }}>
          <h1>Nurse Profile</h1>
        </div>
      </div>
    </div>
  );
};

export default NurseProfile;
