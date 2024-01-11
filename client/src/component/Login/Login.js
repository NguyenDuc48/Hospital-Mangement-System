import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import "./login.css";
import axios from "axios";
import BackgroundImage from "../../../src/photo/background.png";
import { Link } from "react-router-dom";
const Login = (props) => {
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/login", {
        username: inputUsername,
        password: inputPassword,
      });
      if (response.status === 200) {
        const { message, token } = response.data;
        // console.log(message); // 'Login successful'
        // console.log(token);   // The JWT token
        localStorage.setItem("token", token);
        // console.log(localStorage.getItem('token'));
        props.history.push("/manager/doctor_account");
      }
      if (response.status === 202) {
        const { message, token } = response.data;
        console.log(message); // 'Login successful'
        console.log(token);   // The JWT token
        localStorage.setItem("token", token);
        console.log(localStorage.getItem('token'));
        props.history.push("/patient/get_profile");
      }
      else if (response.status === 201) {
        const { message, token } = response.data;
        console.log(message); // 'Login successful'
        console.log(token);   // The JWT token
        localStorage.setItem("token", token);
        console.log(localStorage.getItem('token'));
        props.history.push("/doctor/get_profile");
      }
      else if (response.status === 203) {
        const { message, token } = response.data;
        console.log(message); // 'Login successful'
        console.log(token);   // The JWT token
        localStorage.setItem("token", token);
        console.log(localStorage.getItem('token'));
        props.history.push("/nurse/get_profile");
      }
      else {
        setShow(true); // Show an error message for unsuccessful login
      }
    } catch (error) {
      console.error("API call error:", error);
      setShow(true); // Show an error message for API call failure
    }

    setLoading(false);
  };
  // const handlePassword = () => { };

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  return (
    <div
      className="sign-in__wrapper"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      {/* Overlay */}
      <div className="sign-in__backdrop"></div>
      {/* Form */}
      <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
        {/* Header */}
        <div className="h4 mb-2 text-center">Đăng nhập</div>
        {/* ALert */}
        {show ? (
          <Alert
            className="mb-2"
            variant="danger"
            onClose={() => setShow(false)}
            dismissible
          >
            Sai tài khoản hoặc mật khẩu.
          </Alert>
        ) : (
          <div />
        )}
        <Form.Group className="mb-2" controlId="username">
          <Form.Label>Số điện thoại</Form.Label>
          <Form.Control
            type="text"
            value={inputUsername}
            placeholder="Username"
            onChange={(e) => setInputUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="password">
          <Form.Label>Mật khẩu</Form.Label>
          <Form.Control
            type="password"
            value={inputPassword}
            placeholder="Password"
            onChange={(e) => setInputPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="checkbox">
          <Form.Check type="checkbox" label="Ghi nhớ đăng nhập" />
        </Form.Group>
        {!loading ? (
          <Button className="w-100" variant="primary" type="submit">
            Đăng nhập
          </Button>
        ) : (
          <Button className="w-100" variant="primary" type="submit" disabled>
            Đang chuyển hướng...
          </Button>
        )}
        {/* <div className="d-grid justify-content-end">
          <Button
            className="text-muted px-0"
            variant="link"
            onClick={handlePassword}
          >
            Forgot password?
          </Button>
        </div> */}
        <div className="text-center mt-3">
          Chưa có tài khoản ?{"  "}
          <Link to="/sign_up" className="text-primary">
            Đăng kí ngay
          </Link>
        </div>
      </Form>
      {/* Footer */}
      {/* <div className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-white text-center">
        Made by Hendrik C | &copy;2022
      </div> */}
    </div>
  );
};

export default Login;