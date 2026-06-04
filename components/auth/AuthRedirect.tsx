import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { colors } from "../../styles/theme";

interface AuthRedirectProps {
  text: string;
  linkText: string;
  route: "/(auth)/login" | "/(auth)/register";
}

export default function AuthRedirect({
  text,
  linkText,
  route,
}: AuthRedirectProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>

      <TouchableOpacity onPress={() => router.replace(route)}>
        <Text style={styles.link}>{linkText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    marginTop: 13,
  },

  text: {
    color: "#888",
    fontSize: 13,
  },

  link: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "600",
  },
});
