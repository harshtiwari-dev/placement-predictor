import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const login = (email, password) =>
  api.post("/auth/login", { email, password });

export const signup = (name, email, password) =>
  api.post("/auth/signup", { name, email, password });

export const predict = (formData) => {
  const token = localStorage.getItem("token");
  return api.post("/predict", formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getHistory = () => {
  const token = localStorage.getItem("token");
  return api.get("/predictions/history", {
    headers: { Authorization: `Bearer ${token}` },
  });
};