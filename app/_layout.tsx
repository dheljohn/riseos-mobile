import React, { useCallback, useState, useEffect, useRef } from "react";
import { Stack, router } from "expo-router";
import {
  View,
  AppState,
  AppStateStatus,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AuthInitializer from "../components/AuthInitializer";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk";

import DashboardSkeleton from "../components/DashboardSkeleton";

import { colors } from "../styles/theme";

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  type AppRoute = "/(dashboard)" | "/(auth)/login";
  const [targetRoute, setTargetRoute] = useState<AppRoute | null>(null);
  const [queryClient] = useState(() => new QueryClient());

  const appState = useRef<AppStateStatus>(AppState.currentState);

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_700Bold,
  });

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current === "active" &&
        nextAppState.match(/inactive|background/)
      ) {
      }

      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleReady = useCallback(() => {
    setTargetRoute("/(dashboard)");
  }, []);

  const handleFail = useCallback(() => {
    setTargetRoute((prev) => {
      if (prev === "/(auth)/login") return prev;
      return "/(auth)/login";
    });
  }, []);

  useEffect(() => {
    if (!fontsLoaded || !targetRoute) return;

    const timer = setTimeout(() => {
      setReady(true);
      router.replace(targetRoute);
    }, 16);

    return () => clearTimeout(timer);
  }, [fontsLoaded, targetRoute]);

  if (!fontsLoaded && !fontError) {
    return (
      <SafeAreaProvider>
        <View style={[styles.container, { backgroundColor: "#0f0f0f" }]}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: "#0f0f0f" }}>
        <QueryClientProvider client={queryClient}>
          <AuthInitializer onReady={handleReady} onFail={handleFail} />

          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(dashboard)" />
          </Stack>

          {!ready && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "#0f0f0f",
              }}
            >
              {targetRoute === "/(dashboard)" ? (
                <DashboardSkeleton />
              ) : (
                <View
                  style={[styles.container, { backgroundColor: "#0f0f0f" }]}
                >
                  <ActivityIndicator size="large" color={colors.accent} />
                </View>
              )}
            </View>
          )}
        </QueryClientProvider>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
