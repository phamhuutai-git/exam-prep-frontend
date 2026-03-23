import api from "../apiClient";

const classExamService = {

    updateExam: (id, data) => api.put(`/admin/classes/${id}/exams`, data),

};

export default classExamService;

