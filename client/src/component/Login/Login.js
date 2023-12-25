import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import "./login.css";
import axios from "axios";


import BackgroundImage from "./assets/background.png";
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
      
      // Assuming your API returns a success status
      if (response.status === 200) {
        const { message, token } = response.data;
        // console.log(message); // 'Login successful'
        // console.log(token);   // The JWT token

        // Save the token in your application state or local storage as needed
        // For example, you can use a state variable or a global state management solution
        localStorage.setItem("token", token);
        // console.log(localStorage.getItem('token'));
        // Redirect to the new path upon successful login
        props.history.push("/manager/doctor_account");
      } 
      if (response.status === 202) {
        const { message, token } = response.data;
        console.log(message); // 'Login successful'
        console.log(token);   // The JWT token

        // Save the token in your application state or local storage as needed
        // For example, you can use a state variable or a global state management solution
        localStorage.setItem("token", token);
        console.log(localStorage.getItem('token'));

        // Redirect to the new path upon successful login
        props.history.push("/patient/get_profile");
      } 
     else if (response.status === 201) {
        const { message, token } = response.data;
        console.log(message); // 'Login successful'
        console.log(token);   // The JWT token

        // Save the token in your application state or local storage as needed
        // For example, you can use a state variable or a global state management solution
        localStorage.setItem("token", token);
        console.log(localStorage.getItem('token'));

        // Redirect to the new path upon successful login
        props.history.push("/doctors/login/doctor_home");
      } 
     else if (response.status === 203) {
        const { message, token } = response.data;
        console.log(message); // 'Login successful'
        console.log(token);   // The JWT token

        // Save the token in your application state or local storage as needed
        // For example, you can use a state variable or a global state management solution
        localStorage.setItem("token", token);
        console.log(localStorage.getItem('token'));

        // Redirect to the new path upon successful login
        props.history.push("/employee/login/employee_home");
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
  const handlePassword = () => {};

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
        <img
          className="img-thumbnail mx-auto d-block mb-2"
        />
        <div className="h4 mb-2 text-center">Sign In</div>
        {/* ALert */}
        {show ? (
          <Alert
            className="mb-2"
            variant="danger"
            onClose={() => setShow(false)}
            dismissible
          >
            Incorrect username or password.
          </Alert>
        ) : (
          <div />
        )}
        <Form.Group className="mb-2" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={inputUsername}
            placeholder="Username"
            onChange={(e) => setInputUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={inputPassword}
            placeholder="Password"
            onChange={(e) => setInputPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="checkbox">
          <Form.Check type="checkbox" label="Remember me" />
        </Form.Group>
        {!loading ? (
          <Button className="w-100" variant="primary" type="submit">
            Log In
          </Button>
        ) : (
          <Button className="w-100" variant="primary" type="submit" disabled>
            Logging In...
          </Button>
        )}
        <div className="d-grid justify-content-end">
          <Button
            className="text-muted px-0"
            variant="link"
            onClick={handlePassword}
          >
            Forgot password?
          </Button>
        </div>
      </Form>
      {/* Footer */}
      <div className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-white text-center">
        Made by Hendrik C | &copy;2022
      </div>
    </div>
  );
};

export default Login;