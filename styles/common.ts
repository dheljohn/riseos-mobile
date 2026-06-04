import { StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "./theme";

export const common = StyleSheet.create({
  // containers
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },

  // inputs
  input: {
    backgroundColor: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.md,
    color: colors.textPrimary,
    fontSize: typography.base,
  },

  // buttons
  primaryBtn: {
    backgroundColor: colors.textPrimary,
    borderRadius: radius.md,
    padding: 14,
    alignItems: "center" as const,
  },
  primaryBtnText: {
    color: colors.textPrimary,
    fontWeight: "700" as const,
    fontSize: typography.md,
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 14,
    alignItems: "center" as const,
  },
  secondaryBtnText: {
    color: "#aaa",
    fontWeight: "600" as const,
  },

  // text
  title: {
    fontSize: typography.xxl,
    fontWeight: "800" as const,
    color: colors.textPrimary,
  },
  sectionHeader: {
    fontSize: typography.lg,
    fontWeight: "700" as const,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.sm,
    color: colors.textMuted,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.sm,
  },

  // layout
  row: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },
  header: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: spacing.lg,
    marginBottom: spacing.xl + 4,
  },
});
