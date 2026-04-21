import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "/api";

export const http = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
