import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginApi } from "../api/authApi";
import Cookies from "js-cookie";
import AuthContext from "../AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginApi(formData);
      console.log("User logged in successfully:", response);
      toast("User logged in successfully");
      if (response.success) {
        const token = response.result.token;
        Cookies.set("authorization", token, { expires: 7 });
        login();
        navigate("/");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.error.error.details[0].message;
        toast(errorMessage);
      } else if (error.response && error.response.status === 401) {
        const errorMessage = error.response.data.result.message;
        toast(errorMessage);
      } else {
        console.error("Failed to login:", error.message);
      }
    }
  };

  return (
    <div className="container">
      <div className="wrapper">
        <ToastContainer />
        <div className="title">
          <span>Login Form</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <i className="fas fa-user"></i>
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="row">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {/* <div className="pass">
            <a href="/">Forgot password?</a>
          </div> */}
          <div className="row button">
            <input type="submit" value="Login" />
          </div>
          <div className="signup-link">
            Not a member? <Link to="/signup">Signup now</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
