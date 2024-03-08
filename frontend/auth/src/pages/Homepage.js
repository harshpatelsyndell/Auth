import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import Cookies from "js-cookie";
import AuthContext from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { getAllUserNames } from "../api/allUser";
import { getUserDetails } from "../api/userDetail";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Homepage = () => {
  const { authenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    window.location.reload();
  };

  const [userNames, setUserNames] = useState([]);
  const [userDetails, setUserDetails] = useState([]);

  useEffect(() => {
    if (authenticated) {
      const fetchUserNames = async () => {
        try {
          const names = await getAllUserNames();
          setUserNames(names);
        } catch (error) {
          console.error("Failed to fetch user names:", error.message);
        }
      };

      fetchUserNames();
    }
  }, [authenticated]);

  useEffect(() => {
    if (authenticated) {
      const fetchUser = async () => {
        try {
          const userDetails = await getUserDetails();
          setUserDetails(userDetails);
        } catch (error) {
          console.error("Failed to user details:", error.message);
        }
      };

      fetchUser();
    }
  }, [authenticated]);

  return (
    <div className="bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] h-screen">
      <ToastContainer />
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
          <Link to="/login">
            <button className="bg-[#212121] text-white px-5 py-1 rounded">
              Login
            </button>
          </Link>
        )}
      </div>

      <div className="p-5 flex justify-between items-center">
        <div className="">
          {authenticated ? (
            <div className="flex gap-5">
              <button className="bg-[#082f49] text-white px-5 py-1 rounded font-[glory] hover:bg-[#075985] transition-all duration-200">
                Your Post
              </button>
              <button className="bg-[#082f49] hover:bg-[#075985] text-white px-5 py-1 rounded font-[glory] group transition-all duration-200">
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white group-hover:rotate-90 transition-all duration-200"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 12h14m-7 7V5"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <Link to="/login">
              <button className="bg-[#082f49] text-white px-5 py-1 rounded font-[glory]">
                LogIn to Add Your Blogs
              </button>
            </Link>
          )}
        </div>
        <div className="flex items-center gap-5">
          {authenticated && (
            <img
              src={`http://localhost:8000/${userDetails.imagePath}`}
              alt=""
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <p className="font-[glory] font-semibold text-[20px] text-[#082f49]">
              Your Email: {authenticated ? `${userDetails.email}` : "Guest"}
            </p>
            <p className="font-[glory] font-semibold text-[20px] text-[#082f49]">
              Name: {authenticated ? `${userDetails.name}` : "Guest"}
            </p>
          </div>
        </div>
      </div>

      <div className="">
        {authenticated && (
          <div className="my-10">
            <h2>User Names</h2>
            <ul>
              {userNames.map((name, index) => (
                <li key={index}>{name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
