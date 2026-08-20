import axios from "axios";

const API_URL = "http://localhost:5217/api/report";

export const getPublicDashboard = async () => {
    const response = await axios.get(`${API_URL}/PublicDashboard`);
    return response.data;
};