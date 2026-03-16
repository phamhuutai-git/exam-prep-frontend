// import { toast } from "react-toastify";
// import api from "../apiClient";

// const examService = {
//   getAllExams: () => api.get("/teacher/exams"),

//   getAllCategory: () => api.get("/teacher/exams/allCategory"),

//   //   createExam: (data) => api.post("/teacher/exams", data),

//   //   updateExam: (id, data) => api.put(`/teacher/exams/${id}`, data),

//   deleteExam: (id) => api.delete(`/teacher/exams/${id}`),
// };

// export default examService;

// export async function getExamsByTeacher() {
//   return api
//     .get("/teacher/exams/teacher-name")
//     .then((response) => {
//       return response;
//     })
//     .catch((error) => {
//       toast.error("Lỗi khi tải danh sách đề thi");
//     });
// }

// export async function getQuestionsByExamId(examId) {
//   return api
//     .get(`/teacher/questions/exam-id/${examId}`)
//     .then((response) => {
//       return response;
//     })
//     .catch((error) => {
//       toast.error("Lỗi khi tải danh sách câu hỏi");
//     });
// }

// export async function getExamsByTeacher() {

//   return api.get("/teacher/exams/teacher-name")
//     .then((response) => {

//       return response;

//     }).catch((error) => {

//       toast.error("Lỗi khi tải danh sách đề thi")

//     });
// }

// export async function getQuestionsByExamId(examId) {
//   return api.get(`/teacher/questions/exam-id/${examId}`)
//     .then((response) => {

//       return response;

//     }).catch((error) => {

//       toast.error("Lỗi khi tải danh sách câu hỏi")
//     });
// }
import { toast } from "react-toastify";
import api from "../apiClient";

const examService = {
  getAllExams: () => api.get("/teacher/exams"),

  getAllCategory: () => api.get("/teacher/exams/allCategory"),

  // createExam: (data) => api.post("/teacher/exams", data),

  // updateExam: (id, data) => api.put(`/teacher/exams/${id}`, data),

  deleteExam: (id) => api.delete(`/teacher/exams/${id}`),
};

export default examService;

export async function getExamsByTeacher() {
  return api
    .get("/teacher/exams/teacher-name")
    .then((response) => {
      return response;
    })
    .catch(() => {
      toast.error("Lỗi khi tải danh sách đề thi");
    });
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
