import api from "./api";

export const getProfile = async () => {
  const response = await api.get("/User/profile");
  return response.data;
};

export const updateProfile = async (user) => {
  const response = await api.put("/User/profile", {
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
  });

  return response.data;
};

export const changePassword = async (data) => {
  const response = await api.put("/User/change-password", data);
  return response.data;
};