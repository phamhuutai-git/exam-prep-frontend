import api from "./apiClient";
// lay danh sach lop hoc
///admin/classes
export const getClasses = (params = {}) => {
  return api.get("/admin/classes", { params: { size: 5, ...params } });
};
export const getClass = (id) => {
  return api.get(`/admin/classes/${id}`);
};
export const createClass = (data) => {
  return api.post("/admin/classes", data);
};

export const updateClass = (id, data) => {
  return api.put(`/admin/classes/${id}`, data);
};

export const deleteClass = (id) => {
  return api.delete(`/admin/classes/${id}`);
};

export const getClassStudents = (classId) => {
  return api.get(`/admin/classes/${classId}/students`);
};

export const addUsersToClass = (classId, userIds) => {
  return api.post(`/admin/classes/${classId}/students`, { userIds });
};
