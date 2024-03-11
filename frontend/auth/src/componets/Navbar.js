import React, { useContext } from "react";
import AuthContext from "../AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { authenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
    window.location.reload();
  };
  return (
    <div className="flex justify-between items-center p-5 bg-[#cbd5e1]">
      <p className="text-3xl font-[glory]">Home</p>
      {authenticated ? (
        <div className="flex gap-5 items-center">
          <p className="text-[#065f46]">You are logged in!</p>
          <button
            className="bg-[#212121] text-white px-5 py-1 rounded"
            onClick={() => handleLogout()}
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex gap-5">
          <Link to="/">
            <button className="bg-[#212121] text-white px-5 py-1 rounded">
              Homepage
            </button>
          </Link>
          <Link to="/login">
            <button className="bg-[#212121] text-white px-5 py-1 rounded">
              Login
            </button>
          </Link>
          <Link to="/signup">
            <button className="bg-[#212121] text-white px-5 py-1 rounded">
              Register
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
