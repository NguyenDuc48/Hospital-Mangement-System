import React from 'react';
import Logo from '../../../src/photo/logo.png';
import '../Manager/manager.css';

const Header = () => {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="index.html">
            {/* <img src="../assets/img/logo/logo.png" alt="AHHHHHHHHAHA" /> */}
            <img src={Logo} alt="Logo" />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              {/* <li className="nav-item">
                <a className="nav-link" href="index.html">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="about.html">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="doctor.html">Doctors</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="department.html">Department</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="blog.html">Blog</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="contact.html">Contact</a>
              </li> */}
            </ul>
            <div className="header-right-btn ml-3">
              <a href="/" className="custom-logout-btn">
                Log Out 
              </a>
            </div>

          </div>
        </div>
      </nav>
  
    </header>
    
  );
};

export default Header;
