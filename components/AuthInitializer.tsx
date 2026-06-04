import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { useAuthStore } from "../lib/store";
import {
  getRefreshToken,
  deleteRefreshToken,
  saveRefreshToken,
} from "../lib/secureStore";
import axios from "axios";

const DEBOUNCE_MS = 10000;
const BASE_URL = process.env.EXPO_PUBLIC_API_URL!;

export default function AuthInitializer({
  onReady,
  onFail,
}: {
  onReady: () => void;
  onFail: () => void;
}) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const hasRun = useRef(false);
  const appState = useRef(AppState.currentState);
  const isRefreshing = useRef(false);
  const lastInitTime = useRef(0);

  async function init(trigger: "cold_start" | "foreground_resume") {
    const now = Date.now();

    if (isRefreshing.current) {
      return;
    }

    if (
      trigger === "foreground_resume" &&
      now - lastInitTime.current < DEBOUNCE_MS
    ) {
      return;
    }

    lastInitTime.current = now;
    isRefreshing.current = true;

    try {
      const refreshToken = await getRefreshToken();

      if (!refreshToken) {
        clearAuth();
        onFail();
        return;
      }

      const res = await axios.post(`${BASE_URL}/api/auth/refresh`, {
        refreshToken,
      });

      await saveRefreshToken(res.data.refreshToken);

      setAuth(res.data.accessToken, res.data.user);

      onReady();
    } catch (error: any) {
      const status = error?.response?.status;

      if (status === 401) {
        await deleteRefreshToken();
        clearAuth();

        onFail();
      } else {
        onFail();
      }
    } finally {
      isRefreshing.current = false;
    }
  }

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;

      init("cold_start");
    }

    const sub = AppState.addEventListener("change", (nextState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextState === "active"
      ) {
        init("foreground_resume");
      }
      appState.current = nextState;
    });

    return () => sub.remove();
  }, []);

  return null;
}
