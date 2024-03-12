import axios from "axios";

const API_URL = "http://localhost:8000/api/user"; // Adjust URL as per your backend API

const signup = async (userData) => {
  const response = await axios.post(`${API_URL}/signup`, userData, {
    withCredentials: true,
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

const loginApi = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData, {
    withCredentials: true,
  });
  return response.data;
};

const signupWithGoogle = async (userGoogleData) => {
  const response = await axios.post(
    `${API_URL}/loginwithgoogle`,
    userGoogleData,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export { signup, loginApi, signupWithGoogle };
