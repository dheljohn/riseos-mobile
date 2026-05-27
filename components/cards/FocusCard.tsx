import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { cardStyles as styles } from "./Cardstyle";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigate } from "../../lib/useNavigate";

interface FocusCardProps {
  totalFocusMinutes: number;
  todaysSessions: number;
}

export default function FocusCard({
  totalFocusMinutes,
  todaysSessions,
}: FocusCardProps) {
  const { navigate } = useNavigate();
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigate("/(dashboard)/focus")}
    >
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          {/* <Ionicons name="bed-outline" size={18} color="#22e7ff" /> */}
          <AntDesign name="aim" size={18} color="#00f0f2" />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.label}>Focus</Text>
          <Text style={styles.value}>{totalFocusMinutes}m</Text>
          <Text style={styles.sub}>{todaysSessions} session</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={22} color="#7b8190" />
    </TouchableOpacity>
  );
}
