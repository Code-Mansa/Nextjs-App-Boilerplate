import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api",
  withCredentials: true,
});

// Only redirect if NOT already on login page
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== "/login" && !currentPath.startsWith("/login")) {
        window.location.href = "/login?reason=session_expired";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
