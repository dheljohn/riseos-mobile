import { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "../../lib/store";
import { deleteRefreshToken, saveRefreshToken } from "../../lib/secureStore";
import api from "../../lib/api";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../styles/theme";
import AuthRedirect from "../../components/auth/AuthRedirect";
import { useQueryClient } from "@tanstack/react-query";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();
  const isSubmitting = useRef(false);

  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(override?: { email: string; password: string }) {
    if (isSubmitting.current) return;
    isSubmitting.current = true;
    setError("");
    setLoading(true);

    const loginEmail = override?.email ?? email;
    const loginPassword = override?.password ?? password;

    if (!loginEmail.trim()) {
      setError("Please enter your email.");
      setLoading(false);
      return;
    }

    if (!loginPassword) {
      setError("Please enter your password.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/api/auth/login", {
        email: loginEmail,
        password: loginPassword,
      });

      const { accessToken, refreshToken, user } = res.data;

      await deleteRefreshToken();

      if (refreshToken) {
        await saveRefreshToken(refreshToken);
      }

      queryClient.clear();
      setAuth(accessToken, user);
      router.replace("/(dashboard)");
    } catch (err: any) {
      const message =
        err.response?.data?.error ?? "Login failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
      isSubmitting.current = false;
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.inner}>
        <View style={styles.topSection}>
          <Image
            source={require("../../assets/newLogo.png")}
            style={styles.image}
          />
        </View>

        <Text style={styles.loginWelcome}>WELCOME BACK</Text>
        <Text style={styles.loginHeader}>Resume your discipline.</Text>
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

        <AuthRedirect
          text="New here?"
          linkText="Create account"
          route="/(auth)/register"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  image: {
    width: 50,
    height: 50,
  },
  header: {
    alignItems: "flex-start",
    gap: 6,
  },
  topSection: {
    paddingTop: 60,
    marginBottom: 60,
  },
  loginWelcome: {
    color: "#888",
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    letterSpacing: 1.5,
  },
  loginHeader: {
    color: "#fff",
    fontSize: 38,
    fontFamily: "SpaceGrotesk_500Medium",
    marginBottom: 18,
  },
  logo: {
    fontSize: 28,
    letterSpacing: -1,
    fontFamily: "SpaceGrotesk_500Medium",
    color: "#fff",
  },

  passContainer: {
    padding: 20,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.bgCard,
    overflow: "hidden",
  },
  input: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 14,
    color: "#fff",
    fontSize: 15,
  },
  passInput: {
    flex: 1,
    zIndex: 1,
    height: 50,
    paddingHorizontal: 15,
    color: "#fff",
    backgroundColor: colors.bgCard,
  },
  iconContainer: {
    backgroundColor: colors.bgCard,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 12,
  },

  title: {
    fontSize: 36,
    color: "#fff",
    textAlign: "center",
    marginBottom: 4,
    fontFamily: "SpaceGrotesk_700Bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 24,
  },

  button: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#0f0f0f",
    fontWeight: "500",
    fontSize: 15,
  },
  error: { color: "#ff4d4d", textAlign: "center", fontSize: 13 },
  link: {
    color: colors.accent,
    textAlign: "center",
    marginTop: 8,
    fontSize: 13,
  },
});
