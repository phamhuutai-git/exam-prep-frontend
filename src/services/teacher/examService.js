import api from "../apiClient";

const examService = {
  // --- Các hàm cơ bản ---
  getAllExams: (page, size) =>
      api.get(`/teacher/exams?page=${page}&size=${size}`),

  getAllCategory: () => api.get("/teacher/exams/allCategory"),

  createExam: (data) => api.post("/teacher/exams", data),

  updateExam: (id, data) => api.put(`/teacher/exams/${id}`, data),

  deleteExam: (id) => api.delete(`/teacher/exams/${id}`),

  // --- TÍNH NĂNG AZOTA STYLE (MỚI THÊM) ---

  /**
   * API gọi bộ Parser ở Backend để bóc tách câu hỏi từ văn bản thô
   * Dùng cho chức năng Live Preview (Gõ bên phải - Hiện bên trái)
   */
  parsePreview: (rawText) =>
      api.post("/teacher/questions/parse-preview", { rawText }),

  /**
   * API lưu chính thức đề thi được tạo nhanh từ văn bản thô
   */
  createExamFast: (data) =>
      api.post("/teacher/exams/fast-create", data),

  /**
   * API gọi sang Backend để kết nối với Google Gemini AI sinh câu hỏi
   */
  generateFromAI: (data) =>
      api.post("/ai/generate-questions", data),
};

export default examService;

// --- Các hàm Export lẻ (Giữ nguyên phong cách của bạn) ---

export async function getExamsByTeacher(params) {
  return api
      .get("/teacher/exams/teacher-name", { params })
      .then((response) => response)
      .catch((error) => { throw error; });
}

export async function getQuestionsByExamId(examId) {
  return api
      .get(`/teacher/questions/exam-id/${examId}`)
      .then((response) => response)
      .catch((error) => { throw error; });
}

export async function getClassesByTeacher(page, size) {
  return api
      .get(`/admin/classes/teacher?page=${page}&size=${size}`)
      .then((response) => response)
      .catch((error) => { throw error; });
}

export async function getExamAttemptsByTeacher(page, size) {
  return api
      .get(`/teacher/exams/teacher-name/attempts?page=${page}&size=${size}`)
      .then((response) => response)
      .catch((error) => { throw error; });
}