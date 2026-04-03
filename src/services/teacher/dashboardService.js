import api from "../apiClient";

const dashBoardService = {
  scoreDashboard: () => api.get("/teacher/dashboard/score-distribution"),

  stats: () => api.get("/teacher/dashboard/stats"),
};

export default dashBoardService;
