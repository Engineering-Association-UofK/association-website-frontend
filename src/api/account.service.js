import apiClient from "./axiosClient";

export const accountService = {
  getProfile: () => apiClient.get("/v1/account"),
  getCertificates: () => apiClient.get("/v1/account/certificates"),
  updateProfile: (data) =>
    apiClient.put("/v1/account", {
      id: data.id,
      uni_id: data.uni_id,
      name_ar: data.name_ar,
      name_en: data.name_en,
      phone: data.phone,
      department: data.department,
      gender: data.gender,
    }),
  updateProfilePicture: (formData) =>
    apiClient.put("/v1/account/picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updatePassword: (passwordData) =>
    apiClient.put("/v1/account/password", {
      old_password: passwordData.old_password,
      new_password: passwordData.new_password,
      confirm_password: passwordData.confirm_password,
    }),
};

