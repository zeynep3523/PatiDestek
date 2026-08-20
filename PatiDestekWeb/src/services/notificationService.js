import api from "./api";


export const getNotifications = async (userId) => {
    const response = await api.get(`/Notification/user/${userId}`);

    return response.data;
};
