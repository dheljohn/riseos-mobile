import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, Pressable } from "react-native";
import { cardStyles as styles } from "./Cardstyle";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { useNavigate } from "../../lib/useNavigate";
import { colors } from "../../styles/theme";

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
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.onCardPressed]}
      onPress={() => navigate("/(dashboard)/meals")}
    >
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <FontAwesome name="cutlery" size={18} color="#00f0f2" />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.label}>Meal</Text>
          {mealsQuantity === 0 ? (
            <Text style={styles.value}>Tap to log</Text>
          ) : (
            <>
              <Text style={styles.value}>{mealsQuantity}</Text>

              {mealsQuantity !== 0 && (
                <Text style={styles.sub}>{mealsKcal} kcal</Text>
              )}
            </>
          )}
          {/* <Text style={styles.value}>{mealsQuantity}h</Text>
          <Text style={styles.sub}>{mealsKcal} kcal</Text> */}
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color={colors.chevron} />
    </Pressable>
  );
}
