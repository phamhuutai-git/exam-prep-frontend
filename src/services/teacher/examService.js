import { toast } from "react-toastify";
import api from "../apiClient";

const examService = {
  getAllExams: (page, size) =>
    api.get(`/teacher/exams?page=${page}&size=${size}`),

  getAllCategory: () => api.get("/teacher/exams/allCategory"),

  // createExam: (data) => api.post("/teacher/exams", data),

  // updateExam: (id, data) => api.put(`/teacher/exams/${id}`, data),

  deleteExam: (id) => api.delete(`/teacher/exams/${id}`),
};

export default examService;

export async function getExamsByTeacher() {
  try {
    return await api.get("/teacher/exams/teacher-name");
  } catch (error) {
    toast.error("Lỗi khi tải danh sách đề thi");
    throw error;
  }
}

export async function getQuestionsByExamId(examId) {
  return api
    .get(`/teacher/questions/exam-id/${examId}`)
    .then((response) => {
      return response;
    })
    .catch(() => {
      toast.error("Lỗi khi tải danh sách câu hỏi");
    });
}
