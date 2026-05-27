import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { cardStyles as styles } from "./Cardstyle";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigate } from "../../lib/useNavigate";

interface MealsCardProps {
  mealsKcal: number;
  mealsQuantity: number;
}

export default function MealsCard({
  mealsKcal,
  mealsQuantity,
}: MealsCardProps) {
  const { navigate } = useNavigate();
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigate("/(dashboard)/meals")}
    >
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <FontAwesome name="cutlery" size={18} color="#00f0f2" />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.label}>Meal</Text>
          <Text style={styles.value}>{mealsQuantity}</Text>
          <Text style={styles.sub}>{mealsKcal} kcal</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={22} color="#7b8190" />
    </TouchableOpacity>
  );
}
