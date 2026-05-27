import { StyleSheet } from "react-native";

export const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: "#0e121790",
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
