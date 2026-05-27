import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "../../lib/store";
import { saveRefreshToken } from "../../lib/secureStore";
import api from "../../lib/api";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);

  const [showPassword, setShowPassword] = useState(false);

  function quickLogin() {
    handleLogin({
      email: "jj@gmail.com",
      password: "123123123",
    });
  }

  async function handleLogin(override?: { email: string; password: string }) {
    setError("");
    setLoading(true);

    const loginEmail = override?.email ?? email;
    const loginPassword = override?.password ?? password;

    console.log("Login triggered with:", loginEmail);

    try {
      const res = await api.post("/api/auth/login", {
        email: loginEmail,
        password: loginPassword,
      });

      console.log("Login response:", res.data);

      const { accessToken, refreshToken, user } = res.data;

      if (refreshToken) {
        await saveRefreshToken(refreshToken);
      }

      setAuth(accessToken, user);

      console.log("Auth set, navigating to dashboard...");

      router.replace("/(dashboard)");
    } catch (err: any) {
      console.log("Login error:", err.response?.data ?? err.message);

      setError(err.response?.data?.error ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>RiseOS</Text>
        <Text style={styles.subtitle}>Your personal rhythm tracker</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.passInput}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleLogin()}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
          )}
        </TouchableOpacity>
        {__DEV__ && (
          <TouchableOpacity
            style={styles.button}
            onPress={quickLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Quick Login</Text>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
          <Text style={styles.link}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f0f" },
  passContainer: {
    padding: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 8,
    // marginBottom: 15,
    backgroundColor: "#1a1a1a",
  },
  passInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    color: "#fff",
  },
  iconContainer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 12,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 10,
    padding: 14,
    color: "#fff",
    fontSize: 15,
  },
  button: {
    backgroundColor: "#6c63ff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  error: { color: "#ff4d4d", textAlign: "center", fontSize: 13 },
  link: { color: "#6c63ff", textAlign: "center", marginTop: 8, fontSize: 13 },
});
