import React from 'react';

const Department = () => {
    return (
        <div className="department_area section-padding2" id = "department" style = {{marginTop: "200px"}}>
            <div className="container " >
                {/* Section Tittle */}
                <div className="row" style={{marginBottom:"100px"}}>
                    <div className="col-lg-12">
                        <div className="section-tittle text-center mb-100">
                            <span  style={{fontSize: "18px", fontWeight: "800", color: "#396cf0", textTransform: "uppercase", marginBottom: "50px"}}>Our Departments</span>
                            <h2 style={{fontSize:"50px", fontWeight: "800", marginTop: "40px"}}>Our Medical Services</h2>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="depart_ment_tab mb-30">
                            {/* Tabs Buttons */}
                            <ul className="nav" id="myTab" role="tablist">
                                {/* Add your tab items here */}
                                {/* Example: */}
                                <li className="nav-item">
                                    <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">
                                        <i className="flaticon-teeth"></i>
                                        <h4>Ophthalmology</h4>
                                    </a>
                                </li>
                                {/* Add other tab items similarly */}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="dept_main_info white-bg">
                    <div className="tab-content" id="myTabContent">
                        {/* Add your tab content here */}
                        {/* Example for the "Dentistry" tab: */}
                        <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                            <div className="row align-items-center no-gutters">
                                <div className="col-lg-7">
                                    <div className="dept_info">
                                        <h3>Dentist with surgical mask holding <br /> scaler near patient</h3 >
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. </p>
                                        <a href="#" className="dep-btn">Appointment<i className="ti-arrow-right"></i></a>
                                    </div>
                                </div>
                                <div className="col-lg-5">
                                    <div className="dept_thumb">
                                        <img src="assets/img/gallery/department_man.png" alt="" />
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
