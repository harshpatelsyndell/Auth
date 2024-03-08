import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8000/api/user";

const getUserDetails = async () => {
  try {
    const response = await axios.get(`${API_URL}/`, {
      headers: {
        authorization: `Bearer ${Cookies.get("authorization")}`,
      },
    });

    return response.data.result;
  } catch (error) {
    throw new Error(error.response.data.error || "Failed to fetch user names");
  }
};

export { getUserDetails };
