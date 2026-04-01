// Lấy danh sách luyên tập dua theo lop cua sinh vien
import api from "../apiClient";
// vao luyen tap
//teacher/exams/class-id/1/practice
export const getExamsByClass = (classId) => {
  return api.get(`/teacher/exams/class-id/${classId}/practice`);
};
// thi that
//teacher/exams/class-id/1/official
export const getExamsByClassOfficial = (classId) => {
  return api.get(`/teacher/exams/class-id/${classId}/official`);
};
// vao thi 
///exam-attempt/exam-id/1/start
export const startExam = (examId) => {
  return api.post(`/exams-attempt/exam-id/${examId}/start`);
};

///exams-attempt/attempts/1/submit
// ✅ SUBMIT BÀI THI
export const submitExam = (attemptId, answers) => {
  return api.post(`/exams-attempt/attempts/${attemptId}/submit`, {
    answers: answers,
  });
};
//// ✅ LẤY KẾT QUẢ SAU KHI NỘP
export const getReviewExam = (attemptId) => {
  return api.get(`/exams-attempt/attempts/${attemptId}/review-detail`);
};