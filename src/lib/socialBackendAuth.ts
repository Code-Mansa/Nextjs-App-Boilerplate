import api from "@/lib/api";

export async function syncGoogleUser({
  email,
  fullName,
  password,
}: {
  email: string;
  fullName: string;
  password: string;
}) {
  try {
    // Try login first
    await api.post("/auth/login", { email, password });
  } catch (err: any) {
    console.error("LOGIN FAILED:", {
      status: err.response?.status,
      data: err.response?.data,
    });

    // If login fails, try register
    if (err.response?.status === 400 || err.response?.status === 404) {
      await api.post("/auth/register", {
        email,
        username: fullName,
        password,
        provider: "google",
      });
    } else {
      throw err;
    }
  }
}
