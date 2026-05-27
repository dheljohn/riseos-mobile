// lib/useNavigate.ts
import { useRef } from "react";
import { router } from "expo-router";

export function useNavigate() {
  const isNavigating = useRef(false);

  function navigate(route: string) {
    if (isNavigating.current) return;
    isNavigating.current = true;
    router.push(route as any);
    setTimeout(() => {
      isNavigating.current = false;
    }, 1000);
  }

  function replace(route: string) {
    if (isNavigating.current) return;
    isNavigating.current = true;
    router.replace(route as any);
    setTimeout(() => {
      isNavigating.current = false;
    }, 1000);
  }

  return { navigate, replace };
}
