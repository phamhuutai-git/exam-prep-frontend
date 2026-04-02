import api from "../apiClient";

const dashBoardService = {
  scoreDashboard: () => api.get("/teacher/dashboard/score-distribution"),
};

export default dashBoardService;
