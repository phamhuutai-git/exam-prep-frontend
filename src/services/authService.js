import api from "./apiClient";
// dang nhap
export const loginApi = (data) => {
  return api.post("/auth/login", data);
};
// quen mat khau
export const sendOtpApi = (data) => {
  return api.post("/auth/forgot-password", data);
};
// thay đổi mật khẩu
export const resetPasswordApi = (data) => {
  return api.post("/auth/reset-password", data);
};


