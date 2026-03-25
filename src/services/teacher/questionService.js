import api from "../apiClient";

const questionService = {
  getAllQuestion: (params) => api.get("/teacher/questions", { params }),

  getQuestionsByTeacher: (params) =>
    api.get("teacher/questions/my-questions", { params }),

  getAllCategory: () => api.get("/categories"),

  getDetailQuestion: (id) => api.get(`/teacher/questions/${id}`),

  createQuestion: (data) => api.post("/teacher/questions", data),

  updateQuestion: (id, data) => api.put(`/teacher/questions/${id}`, data),

  deleteQuestion: (id) => api.delete(`/teacher/questions/${id}`),

  exportQuestion: () =>
    api.get("/teacher/questions/export-excel", {
      responseType: "blob",
    }),

  importQuestion: (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post("/teacher/questions/import-excel", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  countQuestion: () => api.get("/teacher/questions/count"),
};

export default questionService;
