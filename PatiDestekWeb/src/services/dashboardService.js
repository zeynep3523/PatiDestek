import axios from "axios";
import { API_ORIGIN } from "./api";

const API_URL = `${API_ORIGIN}/api/report`;

export const getPublicDashboard = async () => {
    const response = await axios.get(`${API_URL}/PublicDashboard`);
    return response.data;
};