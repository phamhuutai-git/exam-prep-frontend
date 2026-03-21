import api from "./apiClient";
/**
 * Lấy thông tin user hiện tại
 * GET /api/users/me
 */
export const getCurrentUserApi = () => {
  return api.get("/users/me");
};
/**
 * Cập nhật thông tin cá nhân
 * PUT /api/users/profile
 */
export const updateProfileApi = (data) => {
  return api.put("/users/profile", data);
};

/**
 * Đổi mật khẩu
 * POST /api/users/change-password
 */
export const changePasswordApi = (data) => {
  return api.put("/users/change-password", data);
};
///users?page=0&size=5
export const getUsers = (params = {}) => {
  return api.get("/users", { params: { size: 5, ...params } });
}
//Cho user hoạt động lại
export const unlockUser = (id) => {
  return api.put(`/auth/admin/account/unlock/${id}`);
}
//Khóa user
export const lockUser = (id) => {
  return api.put(`/auth/admin/account/lock/${id}`);
}

export const getStudentsByClass = (classId) => {
  return api.get(`/users/students/class-id/${classId}`);
}
///users/teachers
export const getTeachers = () => {
  return api.get("/users/teachers");
}
// ///users/students
export const getStudents = () => {
  return api.get("/users/students");
}
//users/teachers/class-id/1



