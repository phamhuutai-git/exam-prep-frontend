import api from "./apiClient";


const DEFAULT_BASE = "http://localhost:8080";

const getBase = () => {
  const env = import.meta.env.VITE_API_URL;
  // prefer provided VITE_API_URL (may include /api or /api/v1)
  if (env) return env.replace(/\/$/, "");
  return DEFAULT_BASE;
};

async function getExamsByClass(classId) {
  if (!classId) throw new Error("classId required");

  // Preferred: use axios client which uses VITE_API_URL as base
  // Expectation: server endpoint is /api/v1/exams/class/{classId}, so request /v1/exams/... ensures correct path
  try {
    const res = await api.get(`/v1/exams/class/${classId}`);
    return res.data;
  } catch (e) {
    // fallback to direct fetch to localhost
    const base = getBase();
    const url = `${base.replace(/\/$/, "")}/api/v1/exams/class/${classId}`;
    const r = await fetch(url, { headers: { "Content-Type": "application/json" } });
    if (!r.ok) throw e;
    return await r.json();
  }
}

async function getAllExams() {
  try {
    const res = await api.get(`/v1/exams`);
    return res.data;
  } catch (e) {
    const base = getBase();
    const url = `${base.replace(/\/$/, "")}/api/v1/exams`;
    const r = await fetch(url, { headers: { "Content-Type": "application/json" } });
    if (!r.ok) throw e;
    return await r.json();
  }
}

export default {
  getExamsByClass,
  getAllExams,
};
