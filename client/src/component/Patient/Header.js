import React from 'react';
import Logo from '../../../src/photo/logo.png';
// import '../Manager/manager.css';
const Header = () => {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="index.html">
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
