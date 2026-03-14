import api from "../apiClient";

const examService = {
  getAllExams: () => api.get("/teacher/exams"),

  getAllCategory: () => api.get("/teacher/exams/allCategory"),

  //   createExam: (data) => api.post("/teacher/exams", data),

  //   updateExam: (id, data) => api.put(`/teacher/exams/${id}`, data),

  deleteExam: (id) => api.delete(`/teacher/exams/${id}`),
};

export default examService;
