import { useEffect } from "react";
import { useAuthStore } from "../lib/store";
import { getRefreshToken, saveRefreshToken } from "../lib/secureStore";
import api from "../lib/api";

export default function AuthInitializer({
  onReady,
  onFail,
}: {
  onReady: () => void;
  onFail: () => void;
}) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    async function init() {
      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
          clearAuth();
          onFail();
          return;
        }
        const res = await api.post("/api/auth/refresh", { refreshToken });
        await saveRefreshToken(res.data.refreshToken);
        setAuth(res.data.accessToken, res.data.user);
        onReady();
      } catch {
        clearAuth();
        onFail();
      }
    }
    init();
  }, []);

  return null;
}
