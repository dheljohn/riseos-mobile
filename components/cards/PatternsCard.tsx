import { View, Text, StyleSheet } from "react-native";
import { Lightbulb } from "lucide-react-native";
import { colors } from "../../styles/theme";

interface PatternsCardProps {
  patterns: string[];
}

export default function PatternsCard({ patterns }: PatternsCardProps) {
  if (patterns.length === 0) return null;

  return (
    <View>
      <View style={styles.header}>
        <Lightbulb size={24} color={colors.textMuted} />

        <Text style={styles.title}>PATTERNS</Text>
      </View>

      <View style={styles.card}>
        {patterns.map((p, i) => (
          <Text key={i} style={styles.item}>
            • {p}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,

    marginTop: 20,
    marginBottom: 10,
  },

  title: {
    fontSize: 14,
    fontFamily: "SpaceGrotesk_400Regular",
    letterSpacing: 2,
    color: colors.textMuted,
  },

  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 10,
    padding: 14,

    borderWidth: 1,
    borderColor: colors.border,

    gap: 6,
  },

  item: {
    color: "#ccc",
    fontSize: 13,
    lineHeight: 20,
  },
});
