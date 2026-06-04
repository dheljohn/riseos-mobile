import axios from "axios";
import { useAuthStore } from "./store";
import {
  getRefreshToken,
  deleteRefreshToken,
  saveRefreshToken,
} from "./secureStore";
import { router } from "expo-router";
const BASE_URL = process.env.EXPO_PUBLIC_API_URL!;
let refreshPromise: Promise<string> | null = null;

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const SKIP_REFRESH_ROUTES = ["/auth/login", "/auth/register", "/auth/refresh"];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const shouldSkip = SKIP_REFRESH_ROUTES.some((route) =>
      originalRequest.url?.includes(route),
    );

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !shouldSkip
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = (async () => {
            const storedToken = await getRefreshToken();

            if (!storedToken) throw new Error("No refresh token");
            const res = await axios.post(`${BASE_URL}/api/auth/refresh`, {
              refreshToken: storedToken,
            });

            const {
              accessToken,
              refreshToken: newRefreshToken,
              user,
            } = res.data;
            useAuthStore.getState().setAuth(accessToken, user);
            await saveRefreshToken(newRefreshToken);

            return accessToken;
          })().finally(() => {
            refreshPromise = null;
          });
        }

        const newToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        await deleteRefreshToken();
        useAuthStore.getState().clearAuth();
        router.replace("/(auth)/login");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
