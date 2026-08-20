import api from "./api";

export const getStaff = async () => {
    const response = await api.get("/Staff");
    return response.data;
};
export const createStaff = async (staff) => {
    const response = await api.post("/Staff", staff);
    return response.data;
};
export const deleteStaff = async (id) => {
    const response = await api.delete(`/Staff/${id}`);
    return response.data;
};
export const getStaffById = async (id) => {
    const response = await api.get(`/Staff/${id}`);
    return response.data;
};

export const updateStaff = async (id, staff) => {
    const response = await api.put(`/Staff/${id}`, staff);
    return response.data;
};