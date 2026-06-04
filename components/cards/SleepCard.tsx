import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { cardStyles as styles } from "./Cardstyle";
import { useNavigate } from "../../lib/useNavigate";
import { colors } from "../../styles/theme";

interface SleepCardProps {
  sleepDuration: number;
  sleepQuality: number;
}

export default function SleepCard({
  sleepDuration,
  sleepQuality,
}: SleepCardProps) {
  const { navigate } = useNavigate();
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.onCardPressed]}
      onPress={() => navigate("/(dashboard)/sleep")}
    >
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <Ionicons name="moon" size={18} color="#00f0f2" />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.label}>Sleep</Text>
          {sleepDuration === 0 ? (
            <Text style={styles.value}>Tap to log</Text>
          ) : (
            <>
              <Text style={styles.value}>{sleepDuration}h</Text>

              {sleepQuality !== 0 && (
                <Text style={styles.sub}>{ENERGY_LABELS[sleepQuality]}</Text>
              )}
            </>
          )}
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color={colors.chevron} />
    </Pressable>
  );
}
const ENERGY_LABELS: Record<number, string> = {
  1: "Exhausted",
  2: "Low",
  3: "Okay",
  4: "Good",
  5: "Energized",
};
