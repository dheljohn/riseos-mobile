import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";

import { useAuthStore } from "../../lib/store";
import { deleteRefreshToken } from "../../lib/secureStore";
import StreakCard from "../../components/cards/StreakCard";
import SleepCard from "../../components/cards/SleepCard";
import MealsCard from "../../components/cards/MealCard";
import FocusCard from "../../components/cards/FocusCard";
import { common } from "../../styles/common";
import { colors } from "../../styles/theme";
import { useSummary } from "../../service/hooks/useSummary";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function getPartOfDay(timezone?: string) {
  const date = new Date();

  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: timezone,
    }).format(date),
  );

  if (hour >= 5 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 18) return "Afternoon";
  if (hour >= 18 && hour < 22) return "Evening";

  return "night";
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

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

export default function DashboardScreen() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const insets = useSafeAreaInsets();

  const { data, isLoading, isError, refetch } = useSummary();

  async function handleLogout() {
    await deleteRefreshToken();
    clearAuth();
    router.replace("/(auth)/login");
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#6c63ff" size="large" />
      </View>
    );
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
        paddingTop: insets.top + 20, // ← respects status bar
        paddingBottom: insets.bottom + 90, // ← respects home indicator + nav bar
      }}
      // contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            Good{" "}
            {getPartOfDay(Intl.DateTimeFormat().resolvedOptions().timeZone)}
          </Text>

          <Text style={styles.weekLabel}>
            {/* {new Date(data.weekStart).toLocaleDateString()} —{" "}
            {new Date(data.weekEnd).toLocaleDateString()} */}
            {data.user.name}
          </Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.gap}>
        <StreakCard
          currentStreak={data.user.currentStreak}
          longestStreak={data.user.longestStreak}
        />
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
          todaysSessions={data.focus.todaysSessions}
        />
      </View>

      {/* Sleep */}
      <SectionHeader title="😴 Sleep" />
      <View style={styles.row}>
        <StatCard label="Logs" value={`${data.sleep.totalLogs}`} />
        <StatCard
          label="Avg Duration"
          value={`${data.sleep.avgSleepHours}h`}
          sub={`goal: ${Math.round((data.sleep.avgEnergyLevel / 60) * 10) / 10}h`}
        />
        <StatCard label="Bedtime Gap" value={`${data.sleep.todaySleepDur}h`} />
      </View>

      {/* Meals */}
      <SectionHeader title="🍽️ Meals" />
      <View style={styles.row}>
        <StatCard label="Logs" value={`${data.meals.totalLogs}`} />
        {Object.entries(data.meals.mealsByType ?? {}).map(([type, count]) => (
          <StatCard
            key={type}
            label={type.charAt(0).toUpperCase() + type.slice(1)}
            value={`${count} logs`}
          />
        ))}
      </View>

      {/* Focus */}
      <SectionHeader title="🎯 Focus" />
      <View style={styles.row}>
        <StatCard
          label="Sessions"
          value={`${data.focus.completedSessions}/${data.focus.totalSessions}`}
          sub="completed"
        />
        <StatCard
          label="Total Focus"
          value={`${Math.round(data.focus.totalFocusMinutes)}m`}
        />
        <StatCard
          label="Avg Overrun"
          value={`${Math.round(data.focus.avgSessionDurationMins)}m`}
        />
      </View>

      {/* Patterns */}
      {data.patterns.length > 0 && (
        <>
          <SectionHeader title="💡 Patterns" />
          <View style={styles.patternsCard}>
            {data.patterns.map((p, i) => (
              <Text key={i} style={styles.patternItem}>
                • {p}
              </Text>
            ))}
          </View>
        </>
      )}

      {/* Nav */}
      {/* <SectionHeader title="📋 Log Data" />
        <View style={styles.navGrid}>
          {[
            { label: "Sleep", route: "/(dashboard)/sleep" },
            { label: "Meals", route: "/(dashboard)/meals" },
            { label: "Focus", route: "/(dashboard)/focus" },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.navButton}
              onPress={() => router.push(item.route as any)}
            >
              <Text style={styles.navButtonText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  title: { fontSize: 28, fontWeight: "800", color: colors.textPrimary },
  weekLabel: { fontSize: 12, color: "#888", marginTop: 2 },
  logoutText: { color: "#6c63ff", fontSize: 13 },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: 20,
    marginBottom: 10,
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
