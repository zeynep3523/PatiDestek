import axios from "axios";
import { API_ORIGIN } from "./api";

const API_URL = `${API_ORIGIN}/api/Report`;

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