import api from "./apiClient";

export const loginApi = (data) => {
  return api.post("/auth/login", data);
};

export const sendOtpApi = (data) => {
  return api.post("/auth/forgot-password", data);
};

export const resetPasswordApi = (data) => {
  return api.post("/auth/reset-password", data);
};

export const verifyOtpApi = (data) => {
  return api.post("/auth/verify-otp", data);
};

