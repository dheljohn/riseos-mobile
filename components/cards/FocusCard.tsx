import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, Pressable } from "react-native";
import { cardStyles as styles } from "./Cardstyle";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigate } from "../../lib/useNavigate";
import { colors } from "../../styles/theme";

interface FocusCardProps {
  totalFocusMinutes: number;
  todaySessions: number;
}

export default function FocusCard({
  totalFocusMinutes,
  todaySessions,
}: FocusCardProps) {
  const { navigate } = useNavigate();
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.onCardPressed]}
      onPress={() => navigate("/(dashboard)/focus")}
    >
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          {/* <Ionicons name="bed-outline" size={18} color="#22e7ff" /> */}
          <AntDesign name="aim" size={18} color="#00f0f2" />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.label}>Focus</Text>
          {totalFocusMinutes === 0 ? (
            <Text style={styles.value}>Tap to log</Text>
          ) : (
            <>
              <Text style={styles.value}>{totalFocusMinutes}m</Text>

              {totalFocusMinutes !== 0 && (
                <Text style={styles.sub}>{todaySessions} session</Text>
              )}
            </>
          )}
          {/* <Text style={styles.value}>{totalFocusMinutes}m</Text>
          <Text style={styles.sub}>{todaysSessions} session</Text> */}
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color={colors.chevron} />
    </Pressable>
  );
}
