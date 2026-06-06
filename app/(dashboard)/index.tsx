import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router } from "expo-router";

import { useAuthStore } from "../../lib/store";
import { deleteRefreshToken } from "../../lib/secureStore";
import StreakCard from "../../components/cards/StreakCard";
import SleepCard from "../../components/cards/SleepCard";
import MealsCard from "../../components/cards/MealCard";
import FocusCard from "../../components/cards/FocusCard";
import { colors } from "../../styles/theme";
import { useSummary } from "../../service/hooks/useSummary";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Settings } from "lucide-react-native";
import PatternsCard from "../../components/cards/PatternsCard";
import { useQueryClient } from "@tanstack/react-query";
import DashboardSkeleton from "../../components/DashboardSkeleton";
import SettingsModal from "../../components/SettingsModal";
import { useState } from "react";
import api from "../../lib/api";

function getPartOfDay(timezone?: string) {
  const date = new Date();

  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: timezone,
    }).format(date),
  );

  if (hour >= 5 && hour < 12) return "MORNING";
  if (hour >= 12 && hour < 18) return "AFTERNOON";
  if (hour >= 18 && hour < 22) return "EVENING";

  return "NIGHT";
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
      {sub ? <Text style={styles.cardSub}>{sub}</Text> : null}
    </View>
  );
}

function SectionHeader({
  title,
  icon,
}: {
  title: string;
  icon?: React.ReactNode;
}) {
  return (
    <View style={styles.sectionHeader}>
      {icon}
      <Text style={styles.sectionHeaderTitle}>{title}</Text>
    </View>
  );
}
export default function DashboardScreen() {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const insets = useSafeAreaInsets();

  const { data, isLoading, isError, refetch } = useSummary();

  const [settingsOpen, setSettingsOpen] = useState(false);

  async function handleLogout() {
    await deleteRefreshToken();
    clearAuth();
    queryClient.clear();
    router.replace("/(auth)/login");
  }

  async function handleDeleteAccount() {
    await api.delete("/api/auth/delete-account");

    Alert.alert(
      "Account Deleted",
      "Your account has been permanently deleted.",
      [
        {
          text: "OK",
          onPress: async () => {
            await deleteRefreshToken();
            clearAuth();
            queryClient.clear();
            router.replace("/(auth)/login");
          },
        },
      ],
    );
  }

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load summary</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        padding: 20,
        paddingTop: insets.top + 20,
        paddingBottom: insets.bottom + 90,
      }}
    >
      {/* Header */}

      <View style={styles.header}>
        <View style={styles.profile}>
          {/* <Image
            source={require("../../assets/icon.png")}
            style={styles.image}
          /> */}
          <Text style={styles.greetings}>
            GOOD{" "}
            {getPartOfDay(Intl.DateTimeFormat().resolvedOptions().timeZone)}
          </Text>

          <Text style={styles.name}>{data.user.name.toUpperCase()}</Text>
        </View>

        <TouchableOpacity onPress={() => setSettingsOpen(true)}>
          <View style={styles.iconContainer}>
            <Settings size={20} color={colors.textMuted} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.gap}>
        <StreakCard
          currentStreak={data.user.currentStreak}
          longestStreak={data.user.longestStreak}
        />
        <Text style={styles.today}>TODAY</Text>
        <SleepCard
          sleepDuration={data.sleep.todaySleepDur}
          sleepQuality={data.sleep.todayEnergyLevel}
        />
        <MealsCard
          mealsKcal={data.meals.todayCalories}
          mealsQuantity={data.meals.todaysMeals}
        />
        <FocusCard
          totalFocusMinutes={data.focus.totalFocusMinutes}
          todaySessions={data.focus.todaySessions}
        />
        <PatternsCard patterns={data.patterns} />
      </View>
      <SettingsModal
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profile: {
    display: "flex",
  },
  today: {
    fontSize: 14,
    fontFamily: "SpaceGrotesk_400Regular",
    letterSpacing: 2,
    color: colors.textMuted,
  },
  image: {
    width: 30,
    height: 30,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: "#171b21",
    alignItems: "center",
    justifyContent: "center",
  },

  container: { flex: 1, backgroundColor: colors.bg },
  gap: { gap: 12 },
  content: { padding: 20, paddingBottom: 90 },
  centered: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  greetings: {
    fontSize: 14,
    fontFamily: "SpaceGrotesk_400Regular",
    letterSpacing: 2,
    color: colors.textMuted,
  },
  name: {
    fontSize: 25,
    fontWeight: "700",
    color: colors.textPrimary,
    fontFamily: "SpaceGrotesk_400Regular",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
    marginTop: 24,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  row: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 14,
    flex: 1,
    minWidth: 90,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  cardLabel: { fontSize: 11, color: "#888", marginBottom: 4 },
  cardValue: { fontSize: 15, fontWeight: "700", color: "#fff" },
  cardSub: { fontSize: 11, color: "#666", marginTop: 2 },
  patternsCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    gap: 6,
  },
  patternItem: { color: "#ccc", fontSize: 13, lineHeight: 20 },
  navGrid: { flexDirection: "row", gap: 10, marginTop: 4 },
  navButton: {
    flex: 1,
    backgroundColor: "#6c63ff",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  navButtonText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  errorText: { color: "#ff4d4d", fontSize: 15 },
  retryButton: {
    backgroundColor: "#6c63ff",
    borderRadius: 10,
    padding: 12,
    paddingHorizontal: 24,
  },
  retryText: { color: "#fff", fontWeight: "700" },
});
