// Lấy danh sách luyên tập dua theo lop cua sinh vien
import api from "../apiClient";

// vao luyen tap
//teacher/exams/class-id/1/practice
export const getExamsByClass = (classId, params) => {
    // ---> ĐÃ SỬA: Nhận thêm biến params và truyền vào cấu hình của Axios
    return api.get(`/teacher/exams/class-id/${classId}/practice`, { params: params });
};

// thi that
//teacher/exams/class-id/1/official
export const getExamsByClassOfficial = (classId, params) => {
    // ---> ĐÃ SỬA: Áp dụng tương tự cho trang thi thật
    return api.get(`/teacher/exams/class-id/${classId}/official`, { params: params });
};

// vao thi
///exam-attempt/exam-id/1/start
export const startExam = (examId) => {
    return api.post(`/exams-attempt/exam-id/${examId}/start`);
};

//restart thi
export const restartExam = (examId) => {
    return api.post(`/exams-attempt/exam-id/${examId}/restart`);
};

///exams-attempt/attempts/1/submit
// ✅ SUBMIT BÀI THI
/** Lấy id lượt thi từ body trả về của POST /start hoặc state navigate */
export const resolveAttemptId = (payload) => {
    if (payload == null || typeof payload !== "object") return undefined;
    return payload.attemptId ?? payload.id ?? payload.attempt?.id;
};

export const submitExam = (attemptId, answers) => {
    return api.post(`/exams-attempt/attempts/${attemptId}/submit`, {
        answers: answers,
    });
};
//exams-attempt/attempts/1/submit-ver2

//// ✅ CHI TIẾT XEM LẠI SAU KHI NỘP (thường chỉ có sau submit)
export const getReviewExam = (attemptId) => {
    return api.get(`/exams-attempt/attempts/${attemptId}/review-detail`);
};

// // ✅ LẤY DANH SÁCH BÀI THI THEO LOẠI (OFFICIAL / PRACTICE)
export const getAttemptsByExamType = (examType, pageable) =>
    api({
        method: "get",
        url: "/exams-attempt/attempts/exam-type",
        params: {
            examType,
            page: pageable?.page ?? 0,
            size: pageable?.size ?? 10,
            sort: pageable?.sort ?? [],
        },
    });