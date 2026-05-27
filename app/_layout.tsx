import { useState } from "react";
import { Stack, router } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AuthInitializer from "../components/AuthInitializer";

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: "#0f0f0f" }}>
        <QueryClientProvider client={queryClient}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(dashboard)" />
          </Stack>
          <AuthInitializer
            onReady={() => {
              router.replace("/(dashboard)");
              setReady(true);
            }}
            onFail={() => {
              router.replace("/(auth)/login");
              setReady(true);
            }}
          />
          {!ready && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "#0f0f0f",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator color="#6c63ff" size="large" />
            </View>
          )}
        </QueryClientProvider>
      </View>
    </SafeAreaProvider>
  );
}
