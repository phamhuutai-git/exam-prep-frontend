// Lấy danh sách luyên tập dua theo lop cua sinh vien
import api from "../apiClient";
//teacher/exams/class-id/1/practice
export const getExamsByClass = (classId) => {
  return api.get(`/teacher/exams/class-id/${classId}/practice`);
};
//teacher/exams/class-id/1/official
export const getExamsByClassOfficial = (classId) => {
  return api.get(`/teacher/exams/class-id/${classId}/official`);
};