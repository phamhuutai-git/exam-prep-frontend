import { toast } from "react-toastify";
import api from "../apiClient";

const examService = {
  getAllExams: (page, size) =>
    api.get(`/teacher/exams?page=${page}&size=${size}`),

  getAllCategory: () => api.get("/teacher/exams/allCategory"),

  createExam: (data) => api.post("/teacher/exams", data),

  updateExam: (id, data) => api.put(`/teacher/exams/${id}`, data),

  deleteExam: (id) => api.delete(`/teacher/exams/${id}`),
};

export default examService;

export async function getExamsByTeacher(page, size) {
  return api
    .get(`/teacher/exams/teacher-name?page=${page}&size=${size}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
}

export async function getQuestionsByExamId(examId) {
  return api
    .get(`/teacher/questions/exam-id/${examId}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      toast.error("Lỗi khi tải danh sách câu hỏi");
      throw error;
    });
}
