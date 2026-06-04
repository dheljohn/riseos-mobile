import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Flame } from "lucide-react-native";

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
}

function getDayKey() {
  const now = new Date();

  const adjusted = new Date(now);
  adjusted.setHours(adjusted.getHours() - 5);

  return adjusted.toDateString();
}

function hashString(str: string) {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
}

export function RandomMotivation() {
  const motivationalPhrases = [
    "Keep going you're closer than you think",
    "Small steps still move you forward",
    "Discipline beats motivation",
    "Do it even when you don't feel like it",
    "Progress not perfection",
    "Stay consistent not perfect",
    "One more rep one more try",
    "You'll thank yourself later",
    "Show up today",
    "Hard work compounds",
    "Don't break the streak",
    "Your future needs you",
    "Push through the resistance",
    "You are building something bigger",
    "Focus beats talent when talent is lazy",
    "Keep the momentum alive",
    "Today's effort is tomorrow's result",
    "No excuses just action",
    "Stay locked in",
    "You're not done yet",
  ];

  const key = getDayKey();
  const index = hashString(key) % motivationalPhrases.length;

  return motivationalPhrases[index];
}

export default function StreakCard({
  currentStreak,
  longestStreak,
}: StreakCardProps) {
  const active = currentStreak > 0;

  return (
    <LinearGradient
      locations={[0, 0.9, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={["#111827", "#0b2f3c", "#00d9ff"]}
      style={styles.card}
    >
      <View style={styles.glow} />

      <View style={styles.leftContent}>
        <View style={styles.row}>
          <Flame size={18} color="#67e8f9" />

          <Text style={styles.label}>DISCIPLINE STREAK</Text>
        </View>

        <View style={styles.streak}>
          <Text style={styles.value}>{currentStreak}</Text>

          <Text style={styles.textSmall}>
            {" "}
            day{currentStreak !== 1 ? "s" : ""}
          </Text>
        </View>

        <Text style={styles.sub}>{RandomMotivation()}</Text>

        <Text style={styles.longest}>
          Longest streak {longestStreak} day
          {longestStreak !== 1 ? "s" : ""}
        </Text>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>STATUS</Text>

        <Text style={styles.status}>{active ? "On fire" : "Start today"}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",

    borderRadius: 24,

    padding: 22,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",

    position: "relative",
  },

  glow: {
    position: "absolute",

    width: 260,
    height: 260,

    borderRadius: 999,

    backgroundColor: "#00e5ff",

    opacity: 0.12,

    top: -140,
    right: -100,
  },

  leftContent: {
    flex: 1,
    paddingRight: 16,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",

    gap: 6,

    marginBottom: 10,
  },

  label: {
    color: "#7dd3fc",

    fontSize: 11,

    letterSpacing: 1.2,

    fontFamily: "Inter_500Medium",

    textTransform: "uppercase",
  },

  streak: {
    flexDirection: "row",

    alignItems: "flex-end",
  },

  value: {
    color: "#f8fbff",

    fontSize: 54,

    lineHeight: 58,

    fontFamily: "SpaceGrotesk_700Bold",
  },

  textSmall: {
    color: "#cbd5e1",

    fontSize: 14,

    marginBottom: 10,

    fontFamily: "Inter_400Regular",
  },

  sub: {
    color: "#94a3b8",

    fontSize: 13,

    lineHeight: 18,

    marginTop: 4,

    maxWidth: 220,

    fontFamily: "Inter_400Regular",
  },

  longest: {
    color: "#64748b",

    fontSize: 12,

    marginTop: 10,

    fontFamily: "Inter_400Regular",
  },

  statusContainer: {
    alignItems: "flex-end",

    backgroundColor: "rgba(255,255,255,0.04)",

    paddingHorizontal: 14,
    paddingVertical: 12,

    borderRadius: 16,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  statusLabel: {
    color: "#64748b",

    fontSize: 10,

    marginBottom: 6,

    textTransform: "uppercase",

    letterSpacing: 1,

    fontFamily: "Inter_500Medium",
  },

  status: {
    color: "#67e8f9",

    fontSize: 15,

    fontFamily: "Inter_700Bold",
  },
});
