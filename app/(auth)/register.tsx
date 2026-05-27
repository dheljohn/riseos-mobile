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
import api from "../../lib/api";
import { saveRefreshToken } from "../../lib/secureStore";
import { useAuthStore } from "../../lib/store";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const strength = getPasswordStrength(password);
  const isPasswordValid = Object.values(strength).every(Boolean);

  async function handleRegister() {
    setError("");
    setLoading(true);
    if (!isPasswordValid) {
      setError("Password doesn't meet requirements");
      return;
    }
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }
    try {
      const res = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });
      const { accessToken, refreshToken, user } = res.data;
      await saveRefreshToken(refreshToken);
      setAuth(accessToken, user);
      router.replace("/(dashboard)");
    } catch (err: any) {
      console.log("Register error:", err.response?.data ?? err.message);
      setError(err.response?.data?.error ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  }
  // add this helper above your component
  function getPasswordStrength(password: string) {
    return {
      hasMinLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
    };
  }
  function HintRow({ met, label }: { met: boolean; label: string }) {
    return (
      <View style={styles.hintRow}>
        <Text style={[styles.hintDot, met ? styles.hintMet : styles.hintUnmet]}>
          {met ? "✓" : "✗"}
        </Text>
        <Text
          style={[styles.hintText, met ? styles.hintMet : styles.hintUnmet]}
        >
          {label}
        </Text>
      </View>
    );
  }
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>RiseOS</Text>
        <Text style={styles.subtitle}>Create your account</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />
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
        {password.length > 0 && (
          <View style={styles.hintBox}>
            <HintRow
              met={strength.hasMinLength}
              label="At least 8 characters"
            />
            <HintRow met={strength.hasUppercase} label="One uppercase letter" />
            <HintRow met={strength.hasLowercase} label="One lowercase letter" />
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.passInput}
            placeholder="Confirm Password"
            placeholderTextColor="#888"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
          <Text style={styles.link}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f0f" },
  hintBox: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  hintRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  hintDot: {
    fontSize: 13,
    fontWeight: "700",
    width: 16,
  },
  hintText: {
    fontSize: 13,
  },
  hintMet: { color: "#4caf50" },
  hintUnmet: { color: "#888" },
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
