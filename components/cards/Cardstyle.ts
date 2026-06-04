import { StyleSheet } from "react-native";
import { colors } from "../../styles/theme";

export const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ffffff14",
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 10,
  },

  onCardPressed: {
    backgroundColor: "#0e1217",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 10,
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#171b21",
    alignItems: "center",
    justifyContent: "center",
  },

  textContainer: {
    gap: 2,
  },

  label: {
    color: "#7d8697",
    fontSize: 12,
    letterSpacing: 2,
  },

  value: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 24,
  },

  sub: {
    color: "#9ca3af",
    fontSize: 12,
  },
});
