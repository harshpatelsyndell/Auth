import React, { useContext } from "react";
import { Link } from "react-router-dom";
// import Cookies from "js-cookie";
import AuthContext from "../AuthContext";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const { authenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <p className="">Homepage</p>
      {authenticated ? (
        <>
          <p>You are logged in!</p>
          <button onClick={() => handleLogout()}>Logout</button>
        </>
      ) : (
        <Link to="/login">
          <button>Login</button>
        </Link>
      )}
    </div>
  );
};

export default Homepage;
