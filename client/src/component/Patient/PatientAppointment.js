import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import PatientSidebar from './PatientSidebar';

const PatientAppointment = () => {
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
            <strong>Trọng đức làm ở đây, ahihi</strong>
          
        </div>
      </div>
    </div>
  );
};

export default PatientAppointment;
