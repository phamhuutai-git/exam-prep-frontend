import api from "../apiClient";
const categoriesService = {
  getAllCategories: (params) => api.get("/categories", { params }),

  createCategories: (data) => api.post("/categories", data),

  updateCategories: (id, data) => api.put(`/categories/${id}`, data),

  // deleteCategories: (id) => api.delete(`/categories/${id}`)
}
export default categoriesService