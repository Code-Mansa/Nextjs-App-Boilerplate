import api from "@/lib/api";
import { User } from "@/types";

export const authAPI = {
  login: (data: { email: string; password: string; rememberMe?: boolean }) =>
    api.post<{ user: User }>("/auth/login", data),

  register: (data: { email: string; password: string; username: string }) =>
    api.post("/auth/register", data),

  me: () => api.get<{ user: User }>("/auth/me"),

  logout: () => api.post("/auth/logout"),
};

// Example other services
export const projectAPI = {
  getAll: () => api.get("/dashboard"),
  create: (data: unknown) => api.post("/projects", data),
  // ... more
};
