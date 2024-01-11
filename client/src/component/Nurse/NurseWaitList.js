import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import Header from "./Header";
import NurseSidebar from "./NurseSidebar";
import "./NurseWaitingList.css";
import "./print-styles.css"
import jwt from 'jsonwebtoken';

const NurseWaitList = () => {
  const [waitingList, setWaitingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeRows, setActiveRows] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalTableData, setModalTableData] = useState([]);
  const [totalData, setTotalData] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [isValidAccess, setValidAccess] = useState(false);
  useEffect(() => {
    const decodeToken = () => {  
        const token = localStorage.getItem('token');
        if (!token) {
          setValidAccess(false)
        }
        else {
          const decoded = jwt.decode(token);
          console.log("decode day nay:", decoded)
          if (decoded.userId.substring(0,2) === "YT") 
            setValidAccess(true);
          else setValidAccess(false)
        }
    };
    decodeToken();
  },[]);

  const fetchData = async () => {
    try {
      const response = await axios.get("/nurse/waiting_list");
      setWaitingList(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching waiting list:", error.message);
      setError("Failed to fetch waiting list");
      setLoading(false);
    }
  };
  useEffect(() => {
    const handlePrint = () => {
      window.print();
    };
  
    // Attach the click event handler to the "Print" button
    const printButton = document.getElementById('printButton');
    if (printButton) {
      printButton.addEventListener('click', handlePrint);
    }
  
    // Clean up the event listener when the component is unmounted
    return () => {
      if (printButton) {
        printButton.removeEventListener('click', handlePrint);
      }
    };
  }, []); // Empty dependency array ensures the effect runs only once on mount
  
  

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const response = await axios.get("/nurse/waiting_list");
    //     setWaitingList(response.data);
    //     setLoading(false);
    //   } catch (error) {
    //     console.error("Error fetching waiting list:", error.message);
    //     setError("Failed to fetch waiting list");
    //     setLoading(false);
    //   }
    // };

    fetchData();
  }, [waitingList]);

  const handleToggle = (index) => {
    setActiveRows((prevActiveRows) => {
      const newActiveRows = [...prevActiveRows];
      newActiveRows[index] = !newActiveRows[index];
      return newActiveRows;
    });
  };
  const handlePrint = () => {
    window.print();
  };

  const handleFullNameClick = (patient) => {
    setSelectedPatient(patient);
  };

  //   const handleReportButtonClick = () => {
  //     setShowModal(true);
  //   };
  // const handleReportButtonClick = async (wait_id) => {
  //   try {
  //     const responseTableData = await axios.get(
  //       `/nurse/show_list_in_bill/${wait_id}`
  //     );
  //     setModalTableData(responseTableData.data);

  //     const responseTotalData = await axios.get(
  //       `/nurse/show_bill_info/${wait_id}`
  //     );
  //     setTotalData(responseTotalData.data);
  //     setShowModal(true);
  //   } catch (error) {
  //     console.error(
  //       "Error fetching data for modal table or total data:",
  //       error.message
  //     );
  //     // Handle error as needed
  //   }
  // };
  const handleReportButtonClick = async (wait_id) => {
    try {
      const responseTableData = await axios.get(
        `/nurse/show_list_in_bill/${wait_id}`
      );
      setModalTableData(responseTableData.data);

      const responseTotalData = await axios.get(
        `/nurse/show_bill_info/${wait_id}`
      );
      setTotalData(responseTotalData.data);

      // Set the selected patient data
      const selectedPatient = waitingList.find(
        (patient) => patient.wait_id === wait_id
      );
      setSelectedPatient(selectedPatient);

      setShowModal(true);
    } catch (error) {
      console.error(
        "Error fetching data for modal table or total data:",
        error.message
      );
      // Handle error as needed
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPaymentSuccess(false); // Reset payment success state
  };

  
  const handleReportSubmit = (event) => {
    // Handle form submission logic
    event.preventDefault();
    // You can add logic here to submit the report data
    setShowModal(false);
  };

  const handlePayNow = async (waitId) => {
    try {
      // Make a PUT request to update payment status
      const putResponse = await axios.put(`/nurse/pay/${waitId}`);
      // Handle the PUT response as needed
      console.log("PUT response:", putResponse.data);

      // Make a DELETE request to finalize payment
      const deleteResponse = await axios.delete(`/nurse/pay/${waitId}`);
      // Handle the DELETE response as needed
      console.log("DELETE response:", deleteResponse.data);

      // Set payment success state to true
      handleCloseModal();
      setPaymentSuccess(true);
      // fetchData();
    } catch (error) {
      console.error("Error processing payment:", error.message);
      // Handle error as needed (e.g., show an error message)
    }
  };
  useEffect(() => {
    console.log("paymentSuccess inside Modal:", paymentSuccess);
  }, [paymentSuccess]);
  

  // console.log(modalTableData);
  // console.log("total datA", totalData);
  if (isValidAccess)

  return (
    <div>
      <Header />
      <div
        style={{
          display: "flex",
          overflowY: "auto",
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        <div style={{ width: "25%", marginBottom: "20px" }}>
          <NurseSidebar />
        </div>
        <div
          style={{
            height: "100vh",
            overflow: "scroll initial",
            width: "70%",
          }}
        >
          <div className="container mt-5">
          {paymentSuccess && (
                <Alert variant="success" onClose={() => setPaymentSuccess(false)} dismissible>
                  Payment successful!
                </Alert>
              )}
         

            <div className="d-flex justify-content-center row">
              <div className="col-md-10">
                <div className="rounded">
                  <div className="table-responsive table-borderless">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Wait ID</th>
                          <th>Full name</th>
                          <th>Department Name</th>
                          <th>Description</th>
                          <th>Payment</th>
                        </tr>
                      </thead>
                      <tbody className="table-body">
                        {loading ? (
                          <tr>
                            <td colSpan="6" className="text-center">
                              Loading...
                            </td>
                          </tr>
                        ) : error ? (
                          <tr>
                            <td colSpan="6" className="text-center text-danger">
                              Error: {error}
                            </td>
                          </tr>
                        ) : waitingList.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center">
                              No data available.
                            </td>
                          </tr>
                        ) : (
                          waitingList.map((item, index) => (
                            <tr key={item.wait_id} className="cell-1">
                              <td>{item.wait_id}</td>
                              <td>
                                <span
                                  className="full-name-link"
                                  onClick={() => handleFullNameClick(item)}
                                >
                                  {item.full_name}
                                </span>
                              </td>
                              <td>{item.department_name}</td>
                              <td>{item.description}</td>
                              <td>
                                <Button
                                  style={{
                                    backgroundColor: "#177347",
                                    padding: "2px 10px",
                                    fontSize: "14px",
                                  }}
                                  onClick={() =>
                                    handleReportButtonClick(item.wait_id)
                                  }
                                >
                                  Report
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <Modal  id="modalContent" show={showModal} onHide={handleCloseModal}  dialogClassName="custom-modal-dialog"> 
        <Modal.Body>
          {/* <div id="modalContent" > */}
          <Form onSubmit={handleReportSubmit}>
            <Form.Group controlId="reportForm">
              {/* ... (previous form code) */}

              {/* Table in the modal */}
              <div  class="page-content container">
                <div class="page-header text-blue-d2">
                  <h1 class="page-title text-secondary-d1">
                    <small class="page-info">
                      <i class="fa fa-angle-double-right text-80"></i>
                      NAME :{" "}
                      {totalData && totalData.length > 0
                        ? totalData[0].full_name
                        : "--"}
                    </small>
                  </h1>

                  <div class="page-tools">
                    <div class="action-buttons">
                    <a
                      id="printButton"
                      className="btn bg-white btn-light mx-1px text-95"
                      href="#"
                      data-title="Print"
                      onClick={handlePrint}
                    >
                      <i className="mr-1 fa fa-print text-primary-m1 text-120 w-2"></i>
                      Print
                    </a>
                      <a
                        class="btn bg-white btn-light mx-1px text-95"
                        href="#"
                        data-title="PDF"
                      >
                        <i class="mr-1 fa fa-file-pdf-o text-danger-m1 text-120 w-2"></i>
                        Export
                      </a>
                    </div>
                  </div>
                </div>
                <div  class="container px-0">
                  <div class="row mt-4">
                    <div class="col-12 col-lg-12">
                      {/* <hr class="row brc-default-l1 mx-n1 mb-4" /> */}
                      <div class="row">
                        <div class="col-sm-6">
                          <div>
                            {/* <span class="text-sm text-grey-m2 align-middle">
                              To:
                            </span> */}
                            {/* <span class="text-600 text-120 text-blue align-middle">
                              {totalData && totalData.length > 0
                                ? totalData[0].full_name
                                : "--"}
                            </span> */}
                          </div>
                          <div class="text-grey-m2">
                            {/* <div class="my-1">Street, City</div> */}
                            <i class="fa fa-circle text-blue-m2 text-xs mr-1"></i>{" "}
                            <span class="text-600 text-90">Conclusion :</span>{" "}
                            {totalData && totalData.length > 0
                              ? totalData[0].conclusion
                              : "--"}
                            <div class="my-1">
                              <i class="fa fa-circle text-blue-m2 text-xs mr-1"></i>{" "}
                              <span class="text-600 text-90">Note :</span>{" "}
                              {totalData && totalData.length > 0
                                ? totalData[0].note
                                : "--"}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="mt-4" style={{justifyContent: "space-between"}}>
                      <div class="row text-white bgc-default-tp1 py-25" style={{justifyContent: "space-between", textAlign:"center", fontWeight:"bold"}}>
                          <div class="col-4 col-sm-3">Service Name</div>
                          <div class="col-2 d-sm-block">Day Used</div>
                          <div class="col-2 d-sm-block">Quantity</div>
                          <div class="col-2">Price</div>
                          <div class="col-2">Amount</div>
                        </div>


                      {modalTableData.map((item, index) => (
                          <div key={index} class="row mb-2 mb-sm-0 py-25" style={{justifyContent: "space-between",textAlign:"center"}}>
                            <div class="col-9 col-sm-3">
                              {item.service_name}
                            </div>
                            <div class="d-none d-sm-block col-sm-2">
                              {item.day_used || "--"}
                            </div>
                            <div class="d-none d-sm-block col-4 col-sm-2">
                              {item.quantity_used || "--"}
                            </div>
                            <div class="col-2">${item.price}</div>
                            <div class="col-2">
                              ${(item.quantity_used || 1) * (item.price || 1)}
                            </div>
                          </div>
                        ))}
                        <div class="row mt-3">
                          <div class="col-12 col-sm-7 text-grey-d2 text-95 mt-2 mt-lg-0"></div>

                          <div class="col-12 col-sm-5 text-grey text-90 order-first order-sm-last">
                            <div class="row my-2">
                              <div class="col-7 text-right">Total</div>
                              <div class="col-5">
                                {/* <span class="text-120 text-secondary-d1">{totalData?.total_bill_raw || '--'}</span>
                                 */}
                                {/* <span class="text-120 text-secondary-d1">{totalData.length > 0 ? totalData[0].total_bill_raw : '--'}</span> */}
                                <span class="text-120 text-secondary-d1">
                                  {totalData && totalData.length > 0
                                    ? "$" + totalData[0].total_bill_raw
                                    : "--"}
                                </span>
                              </div>
                            </div>

                            <div class="row my-2">
                              <div class="col-7 text-right" style={{color:"red"}}>
                                After apply health insurance
                              </div>
                              <div class="col-5">
                                {/* <span class="text-110 text-secondary-d1">$225</span> */}
                              </div>
                            </div>

                            <div class="row my-2 align-items-center bgc-primary-l3 p-2">
                              <div class="col-7 text-right">Total Amount</div>
                              <div class="col-5">
                                {/* <span class="text-150 text-success-d3 opacity-2">$2,475</span> */}
                                <span class="text-120 text-secondary-d1">
                                  {totalData && totalData.length > 0
                                    ? "$"+ totalData[0].money_need_to_pay
                                    : "--"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <span class="text-secondary-d1 text-105"></span>
                          {/* <a
                            href="#"
                            class="btn btn-info btn-bold px-4 float-right mt-3 mt-lg-0"
                            onClick={() => handlePayNow(totalData && totalData.length > 0
                              ? totalData[0].wait_id
                              : "--")}
                          >
                            Pay Now
                            
                          </a> */}

                          <a
                            href="#"
                            class="btn btn-info btn-bold px-4 float-right mt-3 mt-lg-0"
                            onClick={() =>
                              handlePayNow(
                                selectedPatient ? selectedPatient.wait_id : null
                              )
                            }
                          >
                            Pay Now
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form.Group>
          </Form>
          {/* </div> */}
        </Modal.Body>
      </Modal>

    </div>
  );
  else
  return (      
  <p
    style={{
      color: 'red',
      fontWeight: 'bold',
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
      padding: '10px',
      backgroundColor: '#ffe6e6',
      borderRadius: '5px',
    }}
  >
    Access Denied
  </p>);
};

export default NurseWaitList;
