import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { cardStyles as styles } from "./Cardstyle";
import { useNavigate } from "../../lib/useNavigate";

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
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigate("/(dashboard)/sleep")}
    >
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <Ionicons name="bed-outline" size={18} color="#00f0f2" />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.label}>Sleep</Text>
          <Text style={styles.value}>{sleepDuration}h</Text>
          <Text style={styles.sub}>{ENERGY_LABELS[sleepQuality]}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={22} color="#7b8190" />
    </TouchableOpacity>
  );
}
const ENERGY_LABELS: Record<number, string> = {
  1: "Exhausted",
  2: "Low",
  3: "Okay",
  4: "Good",
  5: "Energized",
};
