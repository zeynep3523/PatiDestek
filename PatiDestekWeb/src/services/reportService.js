import axios from "axios";

const API_URL = "http://localhost:5217/api/Report";

const getToken = () => {
  return localStorage.getItem("token");
};

export const getDashboard = async () => {
  const response = await axios.get(`${API_URL}/Dashboard`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return response.data;
};
export const getMyReports = async () => {
  const response = await axios.get(`${API_URL}/MyReports`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return response.data;
};
export const getNearbyReports = async (
  latitude,
  longitude,
  radius = 5
) => {
  const response = await axios.get(`${API_URL}/nearby`, {
    params: {
      latitude,
      longitude,
      radius,
    },
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return response.data;
};