import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api/authApi";
import Cookies from "js-cookie";
import AuthContext from "../AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  console.log("hello", formData);

  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    if (e.target.name === "photo") {
      setFormData((prevData) => ({
        ...prevData,
        photo: e.target.files[0],
      }));
    } else {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signup(formData);
      console.log("User signed up successfully:", response);
      // alert("User signed up successfully");
      toast("User signed up successfully");
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
      } else {
        toast("User already exist");
        console.error("Failed to sign up user:", error);
      }
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const formData = new FormData();
  //     formData.append("name", formData.name);
  //     formData.append("email", formData.email);
  //     formData.append("password", formData.password);
  //     formData.append("passwordConfirm", formData.passwordConfirm);
  //     formData.append("photo", formData.photo);

  //     const response = await signup(formData);

  //     console.log("User signed up successfully:", response);
  //     toast("User signed up successfully");

  //     if (response.success) {
  //       const token = response.result.token;
  //       Cookies.set("authorization", token, { expires: 7 });
  //       login();
  //       navigate("/");
  //     }
  //   } catch (error) {
  //     if (error.response && error.response.status === 400) {
  //       const errorMessage = error.response.data.error.error.details[0].message;
  //       toast(errorMessage);
  //     } else {
  //       toast("User already exists");
  //       console.error("Failed to sign up user:", error);
  //     }
  //   }
  // };

  // const notify = () => toast("Wow so easy!");

  return (
    <div className="container">
      <div className="wrapper">
        <ToastContainer />
        <div className="title">
          <span>SignUp Form</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <i className="fas fa-user"></i>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
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
            <i className="fas fa-user"></i>
            <input
              type="file"
              name="photo"
              onChange={handleChange}
              accept=".jpg, .jpeg, .png"
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
          <div className="row">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              name="passwordConfirm"
              placeholder="Confirm Password"
              value={formData.passwordConfirm}
              onChange={handleChange}
              required
            />
          </div>
          <div className="row button">
            <input type="submit" value="Signup" />
          </div>
          <div className="signup-link">
            Already a member? <Link to="/login">Login now</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
