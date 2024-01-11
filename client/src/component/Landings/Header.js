import React from 'react';
import Logo from '../../../src/photo/logo.png';

const Header = () => {
    const handleScrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const handleScrollToHome = () => {
    const aboutSection = document.getElementById('home');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const handleScrollToDepartment = () => {
    const aboutSection = document.getElementById('department');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
              <li className="nav-item">
                <a className="nav-link" href="#home" onClick={handleScrollToHome}>Home</a>
              </li>
              <li className="nav-item">
                  <a className="nav-link" href="#about" onClick={handleScrollToAbout}>
                    About
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="doctor.html">Doctors</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#department">Department</a>
              </li>
              {/* <li className="nav-item">
                <a className="nav-link" href="blog.html">Blog</a>
              </li> */}
              {/* <li className="nav-item">
                <a className="nav-link" href="/sign_up">SIGN UP</a>
              </li> */}
            </ul>
            <div className="nav-item">
              <a href="/login" className="btn header-btn">SIGN IN</a>
            </div>
          </div>
        </div>
      </nav>
  
    </header>
    
  );
};

export default Header;



// import React from 'react';
// import Logo from '../../../src/photo/logo.png';

// const Header = () => {
//   const handleScrollToAbout = () => {
//     const aboutSection = document.getElementById('about');
//     if (aboutSection) {
//       aboutSection.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   return (
//     <header>
//       <nav className="navbar navbar-expand-lg navbar-light bg-light">
//         {/* ... (your existing code) */}
//         <ul className="navbar-nav ml-auto">
//           {/* ... (other navigation items) */}
//           <li className="nav-item">
//             <a className="nav-link" href="#about" onClick={handleScrollToAbout}>
//               About
//             </a>
//           </li>
//           {/* ... (other navigation items) */}
//         </ul>
//         {/* ... (your existing code) */}
//       </nav>
//     </header>
//   );
// };

// export default Header;
