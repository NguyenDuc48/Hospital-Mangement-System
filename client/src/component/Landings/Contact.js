import React from "react";

const Contact = () => {
  return (
    <div id="contact" style={{ backgroundColor: "#11141b", padding: "50px 0", marginTop: "30px", textAlign: "center" }}>
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <h2 style={{ color: "white", marginBottom: "30px" }}>Contact Us</h2>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-6">
            {/* Left side content, e.g., contact form */}
            <form style={{ width: "60%", margin: "0 auto" }}>
              <div className="form-group">
                <label style={{ color: "white" }}>Your Name</label>
                <input style={{ width: "100%" }} type="text" className="form-control" placeholder="Enter your name" />
              </div>
              <div className="form-group">
                <label style={{ color: "white" }}>Email Address</label>
                <input style={{ width: "100%" }} type="email" className="form-control" placeholder="Enter your email" />
              </div>
              <div className="form-group">
                <label style={{ color: "white" }}>Message</label>
                <textarea style={{ width: "100%" }} className="form-control" rows="4" placeholder="Your message"></textarea>
              </div>
              <button className="btn btn-primary">Send Message</button>
            </form>
          </div>
          <div className="col-lg-6">
            {/* Right side content, e.g., contact information */}
            <div style={{ color: "white" }}>
              <h4>Contact Information</h4>
              <p>Address: 334 Nguyen Trai Street, Ha Noi</p>
              <p>Phone: +96 489 322 21</p>
              <p>Email: info@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
