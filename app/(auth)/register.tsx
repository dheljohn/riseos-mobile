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
  Image,
} from "react-native";
import { router } from "expo-router";
import api from "../../lib/api";
import { saveRefreshToken } from "../../lib/secureStore";
import { useAuthStore } from "../../lib/store";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../styles/theme";
import AuthRedirect from "../../components/auth/AuthRedirect";
import { useQueryClient } from "@tanstack/react-query";
import Checkbox from "../../components/CheckBox";
import WebModal from "../../components/WebModal";

export default function RegisterScreen() {
  const BASE_URL = process.env.EXPO_PUBLIC_API_URL!;
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth, clearAuth } = useAuthStore();
  const strength = getPasswordStrength(password);
  const isPasswordValid = Object.values(strength).every(Boolean);

  const [agree, setAgree] = useState(false);

  const [showLegal, setShowLegal] = useState(false);
  const [legalUrl, setLegalUrl] = useState("");

  const allMet =
    strength.hasUppercase && strength.hasLowercase && strength.hasMinLength;
  async function handleRegister() {
    setError("");
    setLoading(true);
    if (!isPasswordValid) {
      setError("Password doesn't meet requirements");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if (!agree) {
      setError("You must agree to the terms and conditions");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });
      const { accessToken, refreshToken, user } = res.data;

      await saveRefreshToken(refreshToken);
      clearAuth();
      queryClient.clear();
      setAuth(accessToken, user);
      router.replace("/(dashboard)");
    } catch (err: any) {
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
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.inner}>
        <View style={styles.topSection}>
          {/* <Text style={styles.logo}>RiseOS</Text> */}
          <Image
            source={require("../../assets/newLogo.png")}
            style={styles.image}
          />
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.loginWelcome}>BEGIN PROTOCOL</Text>
          <Text style={styles.loginHeader}>Train your discipline.</Text>
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
          {password.length > 0 && !allMet && (
            <View style={styles.hintBox}>
              <HintRow
                met={strength.hasUppercase}
                label="One uppercase letter"
              />
              <HintRow
                met={strength.hasLowercase}
                label="One lowercase letter"
              />
              <HintRow
                met={strength.hasMinLength}
                label="At least 8 characters"
              />
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
          <Checkbox value={agree} onChange={setAgree}>
            <Text style={styles.privacyTerms}>
              I agree to the{" "}
              <Text
                style={styles.link}
                onPress={() => {
                  setLegalUrl(`${BASE_URL}/privacy`);
                  setShowLegal(true);
                }}
              >
                Privacy Policy
              </Text>{" "}
              and{" "}
              <Text
                style={styles.link}
                onPress={() => {
                  setLegalUrl(`${BASE_URL}/terms`);
                  setShowLegal(true);
                }}
              >
                Terms of Use
              </Text>
            </Text>
          </Checkbox>

          <WebModal
            visible={showLegal}
            url={legalUrl}
            onClose={() => setShowLegal(false)}
          />

          <AuthRedirect
            text="Have an account?"
            linkText="Log In"
            route="/(auth)/login"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topSection: {
    paddingTop: 60,
    marginBottom: 60,
  },

  image: {
    width: 50,
    height: 50,
  },
  logo: {
    fontSize: 28,
    letterSpacing: -1,
    fontFamily: "SpaceGrotesk_500Medium",
    color: "#fff",
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
  hintBox: {
    padding: 0,
    gap: 0,
  },
  privacyTerms: {
    color: "#888",
  },
  hintRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 0,
  },
  hintDot: {
    fontSize: 10,
    fontWeight: "700",
    width: 16,
  },
  hintText: {
    fontSize: 10,
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
    borderRadius: 8,
    // marginBottom: 15,
    borderColor: colors.border,
    backgroundColor: colors.bgCard,
    overflow: "hidden",
  },
  passInput: {
    flex: 1,
    height: 50,
    borderColor: colors.border,
    backgroundColor: colors.bgCard,
    paddingHorizontal: 15,
    color: "#fff",
  },
  iconContainer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSection: {
    alignSelf: "center",
    gap: 12,
    justifyContent: "center",
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
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
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgCard,
    borderRadius: 10,
    padding: 14,
    color: "#fff",
    fontSize: 15,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { fontWeight: "500", fontSize: 15 },
  error: { color: "#ff4d4d", textAlign: "center", fontSize: 13 },
  link: {
    color: colors.accent,
    textAlign: "center",
    marginTop: 8,
    fontSize: 13,
  },
});
