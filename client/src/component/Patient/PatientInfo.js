import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    phone_no: '',
  });

  const [selectedSection, setSelectedSection] = useState('patient');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [updatedPatientInfo, setUpdatedPatientInfo] = useState({
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    phone_no: '',
  });

  useEffect(() => {
    const token = localStorage.usertoken;
    if (token) {
      const decoded = jwt_decode(token);
      setUserInfo({
        first_name: decoded.first_name,
        last_name: decoded.last_name,
        email: decoded.email,
        address: decoded.address,
        phone_no: decoded.phone_no,
      });
      setUpdatedPatientInfo({
        first_name: decoded.first_name,
        last_name: decoded.last_name,
        email: decoded.email,
        address: decoded.address,
        phone_no: decoded.phone_no,
      });
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPatientInfo({
      ...updatedPatientInfo,
      [name]: value,
    });
  };

  const handlePatientUpdate = () => {
    // Make an API call to update patient information
    // You can use a library like Axios or fetch for this purpose
    // For demonstration purposes, a simple alert is used here
    alert('Patient information updated successfully!');
  };

  return (
    <div className={`container-fluid ${sidebarOpen ? 'open' : ''}`}>
      <div className="row">
        <nav className={`col-md-2 d-none d-md-block bg-light sidebar ${sidebarOpen ? 'open' : ''}`}>
          {/* ... Left Sidebar content ... */}
          <div className="nav flex-column">
            <a
              className={`nav-link ${selectedSection === 'patient' && 'active'}`}
              href="#"
              onClick={() => setSelectedSection('patient')}
            >
              Patient Info
            </a>
            <a
              className={`nav-link ${selectedSection === 'doctor' && 'active'}`}
              href="#"
              onClick={() => setSelectedSection('doctor')}
            >
              Doctor Info
            </a>
            <a
              className={`nav-link ${selectedSection === 'bill' && 'active'}`}
              href="#"
              onClick={() => setSelectedSection('bill')}
            >
              Bill
            </a>
          </div>
        </nav>

        <div className="col-md-10">
          <button className="btn btn-dark d-md-none" onClick={toggleSidebar}>
            {sidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
          </button>

          <div className="jumbotron mt-3">
            <h1 className="text-center mb-4">User Profile</h1>
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <a
                  className={`nav-link ${selectedSection === 'patient' && 'active'}`}
                  href="#"
                  onClick={() => setSelectedSection('patient')}
                >
                  Patient Information
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${selectedSection === 'doctor' && 'active'}`}
                  href="#"
                  onClick={() => setSelectedSection('doctor')}
                >
                  Doctor Information
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${selectedSection === 'bill' && 'active'}`}
                  href="#"
                  onClick={() => setSelectedSection('bill')}
                >
                  Bill
                </a>
              </li>
            </ul>

            {selectedSection === 'patient' && (
              <div>
                <h2 className="mt-4">Edit Patient Information</h2>
                <form>
                  {/* ... Form fields for updating patient information ... */}
                </form>
                <button
                  type="button"
                  className="btn btn-primary mt-3"
                  onClick={handlePatientUpdate}
                >
                  Update Information
                </button>
              </div>
            )}

            {/* ... Render other sections ... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
