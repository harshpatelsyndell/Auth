import axios from "axios";

const API_URL = "http://localhost:8000/api/user"; // Adjust URL as per your backend API

const signup = async (userData) => {
  const response = await axios.post(`${API_URL}/signup`, userData, {
    withCredentials: true,
  });
  return response.data;
};

const loginApi = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData, {
    withCredentials: true,
  });
  return response.data;
};

export { signup, loginApi };
