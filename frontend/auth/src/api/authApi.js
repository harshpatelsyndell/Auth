import axios from "axios";

const API_URL = "http://localhost:8000/api/user"; // Adjust URL as per your backend API

const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error || "Failed to signup");
  }
};

export { signup };
