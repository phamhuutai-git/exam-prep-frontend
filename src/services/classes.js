import api from "./apiClient";
// lay danh sach lop hoc
///admin/classes
export const getClasses = (params = {}) => {
  return api.get("/admin/classes", { params: { size: 5, ...params } });
};
// lay danh sach theo id
export const getClass = (id) => {
  return api.get(`/admin/classes/${id}`);
};
// tạo lớp
export const createClass = (data) => {
  return api.post("/admin/classes", data);
};
// cập nhật lớp
export const updateClass = (id, data) => {
  return api.put(`/admin/classes/${id}`, data);
};
// xóa lớp
export const deleteClass = (id) => {
  return api.delete(`/admin/classes/${id}`);
};
// lấy danh sach sinh viên theo id
export const getClassStudents = (classId) => {
  return api.get(`/admin/classes/${classId}/students`);
};
// thêm sinh viên vào lớp
export const addUsersToClass = (classId, userIds) => {
  return api.put(`/admin/classes/${classId}/students`, userIds);
};
// thêm giao viên vào lớp
// services/classes.js
export const addTeachersToClass = (classId, userIds) => {
  return api.put(`/admin/classes/${classId}/teachers`, userIds);
};