import React from "react";
import { Button } from "react-bootstrap";
import eye from "../../photo/eye.png";
import de from "../../photo/dermatology.png";
import la from "../../photo/laboratory.png";
import psy from "../../photo/psychology.png";
import depman from "../../photo/department_man.png";

const Department = () => {
  return (
    <div
      className="department_area section-padding2"
      id="department"
      style={{ marginTop: "100px" }}
    >
      <div className="container ">
        {/* Section Tittle */}
        <div className="row" style={{ marginBottom: "30px" }}>
          <div className="col-lg-12">
            <div className="section-tittle text-center mb-100">
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "800",
                  color: "#396cf0",
                  textTransform: "uppercase",
                  marginBottom: "50px",
                }}
              >
                Our Departments
              </span>
              <h2
                style={{
                  fontSize: "50px",
                  fontWeight: "800",
                  marginTop: "40px",
                }}
              >
                Our Medical Services
              </h2>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="depart_ment_tab mb-30">
              {/* Tabs Buttons */}
              <ul
                className="nav"
                id="myTab"
                role="tablist"
                style={{ textAlign: "center" }}
              >
                {/* Add your tab items here */}
                {/* Example: */}
                <li
                  className="nav-item"
                  style={{
                    display: "flex",
                    textAlign: "center",
                    justifyContent: "space-around",
                  }}
                >
                  <a
                    className="nav-link active"
                    id="home-tab"
                    data-toggle="tab"
                    href="#home"
                    role="tab"
                    aria-controls="home"
                    aria-selected="true"
                    style={{ padding: "50px" }}
                  >
                    <img
                      src={eye}
                      alt=""
                      style={{ maxWidth: "50%", maxHeight: "50%" }}
                    />
                    <h4 style={{}}>Ophthalmology</h4>
                  </a>
                  <a
                    className="nav-link active"
                    id="home-tab"
                    data-toggle="tab"
                    href="#home"
                    role="tab"
                    aria-controls="home"
                    aria-selected="true"
                    style={{ padding: "50px" }}
                  >
                    <img
                      src={de}
                      alt=""
                      style={{ maxWidth: "50%", maxHeight: "50%" }}
                    />
                    <h4>Dermatology</h4>
                  </a>
                  <a
                    className="nav-link active"
                    id="home-tab"
                    data-toggle="tab"
                    href="#home"
                    role="tab"
                    aria-controls="home"
                    aria-selected="true"
                    style={{ padding: "50px" }}
                  >
                    <img
                      src={la}
                      alt=""
                      style={{ maxWidth: "50%", maxHeight: "50%" }}
                    />
                    <h4>Laboratory</h4>
                  </a>
                  <a
                    className="nav-link active"
                    id="home-tab"
                    data-toggle="tab"
                    href="#home"
                    role="tab"
                    aria-controls="home"
                    aria-selected="true"
                    style={{ padding: "50px" }}
                  >
                    <img
                      src={psy}
                      alt=""
                      style={{ maxWidth: "50%", maxHeight: "50%" }}
                    />
                    <h4>Psychology</h4>
                  </a>
                </li>
                {/* Add other tab items similarly */}
              </ul>
            </div>
          </div>
        </div>
        <div
          className="dept_main_info white-bg"
          style={{ backgroundColor: "#ccc3c3", padding: "0px 0px 0px 50px" }}
        >
          <div className="tab-content" id="myTabContent">
            {/* Add your tab content here */}
            {/* Example for the "Dentistry" tab: */}
            <div
              className="tab-pane fade show active"
              id="home"
              role="tabpanel"
              aria-labelledby="home-tab"
            >
              <div className="row align-items-center no-gutters">
                <div className="col-lg-7">
                  <div className="dept_info">
                    <h3>
                   Four department
                    </h3>
                    <p
                      style={{
                        fontSize: "16px",
                        color: "#6c757d",
                        lineHeight: "1.6",
                      }}
                    >
                      Explore our diverse range of medical services designed to
                      meet your unique needs. Our dedicated team of
                      professionals in Ophthalmology, Dermatology, Laboratory,
                      and Psychology is committed to providing high-quality
                      care. Whether you're seeking expert eye care, skin
                      solutions, precise laboratory diagnostics, or mental
                      health support, our comprehensive services cater to your
                      well-being. 
                    </p>

                    <Button
                    variant="secondary"
                    className="mr-2  "
                    style={{
                      marginBottom: "30px",
                      width: " 30%",
                      padding: "10px",
                    }}
                  >
                    <span>Appointment </span>
                  </Button>
                  </div>
                </div>
                <div className="col-lg-5">
                  <div className="dept_thumb">
                    <img src={depman} style={{ width: "100%" }} alt="" />
                  </div>
                </div>
              </div>
            </div>
            {/* Add other tab content similarly */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Department;
