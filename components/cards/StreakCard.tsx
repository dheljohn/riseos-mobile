import { View, Text, StyleSheet } from "react-native";

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
}

export default function StreakCard({
  currentStreak,
  longestStreak,
}: StreakCardProps) {
  const active = currentStreak > 0;

  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.label}>Current Streak</Text>

        <Text style={styles.value}>
          🔥 {currentStreak} day{currentStreak !== 1 ? "s" : ""}
        </Text>

        <Text style={styles.sub}>
          Longest: {longestStreak} day
          {longestStreak !== 1 ? "s" : ""}
        </Text>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status</Text>

        <Text style={styles.status}>{active ? "On fire" : "Start today"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 18,
    padding: 20,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "#2a2a2a",
  },

  label: {
    color: "#888",
    fontSize: 12,
    marginBottom: 6,
  },

  value: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },

  sub: {
    color: "#888",
    fontSize: 12,
    marginTop: 4,
  },

  statusContainer: {
    alignItems: "flex-end",
  },

  statusLabel: {
    color: "#888",
    fontSize: 11,
    marginBottom: 4,
  },

  status: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});
