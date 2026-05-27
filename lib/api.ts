import axios from "axios";
import { useAuthStore } from "./store";
import { getRefreshToken, deleteRefreshToken } from "./secureStore";
import { router } from "expo-router";

const BASE_URL = "https://riseos-backup.vercel.app";

const api = axios.create({
  baseURL: BASE_URL,
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, try silent refresh then retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("Failed URL:", error.config?.baseURL + error.config?.url);
    console.log("Status:", error.response?.status);
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post(`${BASE_URL}/api/auth/refresh`, {
          refreshToken,
        });
        const { accessToken, user } = res.data;
        useAuthStore.getState().setAuth(accessToken, user);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch {
        await deleteRefreshToken();
        useAuthStore.getState().clearAuth();
        router.replace("/(auth)/login");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
