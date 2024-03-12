import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signup, signupWithGoogle } from "../api/authApi";
import Cookies from "js-cookie";
import AuthContext from "../AuthContext";
import { ToastContainer, toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");
    if (token) {
      Cookies.set("authorization", token, { expires: 7 });
      login();
      navigate("/");
    }
  }, [location.search, login, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDatas = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
        photo: selectedFile,
      };
      console.log("formdata:", formDatas);
      const response = await signup(formDatas);
      console.log("User signed up successfully:", response);

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

  // const notify = () => toast("Wow so easy!");

  // const loginwithgoogle = () => {
  //   window.open("http://localhost:8000/auth/google/callback", "_self");
  // };

  const responseMessage = async (responseFromGoogle) => {
    try {
      const decodedToken = jwtDecode(responseFromGoogle.credential);
      console.log("Decoded JWT token:", decodedToken);
      const formDatas = {
        googleId: decodedToken.sub,
        name: decodedToken.name,
        email: decodedToken.email,
        picture: decodedToken.picture,
      };
      const response = await signupWithGoogle(formDatas);
      toast("User signed up successfully with google");
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
        console.error("Failed to sign up user with google:", error);
      }
    }
  };

  const errorMessage = (error) => {
    console.log(error);
  };

  return (
    <>
      <div className="container">
        <div className="wrapper">
          <ToastContainer />
          <div className="title">
            <span>SignUp Form</span>
          </div>
          <form
            onSubmit={handleSubmit}
            method="post"
            encType="multipart/form-data"
          >
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
                type="email"
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
            <div>
              <p className="">optional</p>
            </div>
            <div className="row">
              <i className="fas fa-user"></i>
              <input
                type="file"
                name="photo"
                onChange={handleFileChange}
                accept=".jpg, .jpeg, .png"
              />
            </div>
            <div className="row button">
              <input type="submit" value="Signup" />
            </div>
            <div className="signup-link">
              Already a member? <Link to="/login">Login now</Link>
            </div>
          </form>
          {/* <div>
            <button onClick={loginwithgoogle}>Sign In with Google</button>
          </div> */}
          <div className="w-full m-auto text-right  p-5">
            <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
          </div>
          {/* <div className="w-full m-auto text-right  p-5">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
              accessType="offline"
              scope="profile email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email"
            />
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Signup;
