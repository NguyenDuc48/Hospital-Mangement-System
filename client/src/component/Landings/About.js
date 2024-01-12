import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import about2 from "../../photo/about2.png";
import about1 from "../../photo/about1.png";
import favicon from "../../photo/favicon.ico";
import "./about.css";
const About = () => {
  return (
    <>
      {/* About Area */}
      <div
        id="about"
        className="about-area section-padding2"
        style={{ paddingTop: "100px" }}
      >
        <Container>
          <Row>
            <Col lg={6} md={10}>
              <div className="about-caption mb-50">
                <div className="section-tittle section-tittle2 mb-35">
                  <span
                    style={{
                      fontSize: "25px",
                      fontWeight: "600",
                      marginBottom: "22px",
                      color: "#396cf0",
                      textTransform: "uppercase",
                    }}
                  >
                    --- About Our Company
                  </span>
                  <h2
                    style={{
                      fontSize: "50px",
                      fontWeight: "800",
                      marginTop: "22px",
                    }}
                  >
                    Welcome To Our Hospital
                  </h2>
                </div>
                <p
                  style={{
                    fontSize: "16px",
                    color: "#6c757d",
                    lineHeight: "1.6",
                  }}
                >
                  Welcome to our hospital, where compassionate care meets
                  cutting-edge expertise. At our facility, we are dedicated to
                  providing high-quality healthcare services tailored to your
                  individual needs. 
                  {/* Our team of experienced professionals is
                  committed to ensuring your well-being and comfort. We
                  understand that each patient is unique, and we strive to
                  create a healing environment that promotes both physical and
                  emotional recovery. */}
                </p>

                <div style={{ width: "100%" }}>
                  <div style={{ width: "50%" }}>
                    <Button
                      // href="#about"
                      variant="secondary"
                      className="mr-2"
                      style={{
                        marginBottom: "30px",
                        width: " 70%",
                        padding: "10px",
                      }}
                    >
                      Quality Doctors <i className="ti-arrow-right"></i>
                    </Button>
                  </div>

                  <div style={{ width: "50%" }}>
                    <Button
                      // href="#about"
                      variant="secondary"
                      className="mr-2  "
                      style={{
                        marginBottom: "30px",
                        width: " 70%",
                        padding: "10px",
                      }}
                    >
                      <span>Appointment </span>
                    </Button>
                  </div>
                  <div style={{ width: "50%" }}>
                    <Button
                      // href="about.html"
                      variant="secondary"
                      style={{
                        marginBottom: "30px",
                        width: " 70%",
                        padding: "10px",
                      }}
                    >
                      Emergency <i className="ti-arrow-right"></i>
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={6} md={12}>
              <div className="">
                <div
                  className=" top-0 end-0 d-none d-lg-block"
                  // style={{ zIndex: 1 }}
                >
                  <img
                    src={about2}
                    alt=""
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                  />
                </div>
                {/* <div
                  className="position-absolute top-0 end-0"
                  style={{ zIndex: 2 }}
                >
                  <img
                    src={about1}
                    alt=""
                    style={{ maxWidth: "100%", maxHeight: "50%" }}
                  />
                </div> */}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default About;
