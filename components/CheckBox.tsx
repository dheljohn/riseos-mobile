import React, { ReactNode } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Check } from "lucide-react-native";
import { colors } from "../styles/theme";

type Props = {
  value: boolean;
  onChange: (value: boolean) => void;
  children: ReactNode;
};

export default function Checkbox({ value, onChange, children }: Props) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onChange(!value)}
      activeOpacity={0.8}
    >
      <View style={[styles.box, value && styles.boxChecked]}>
        {value && <Check size={16} color={colors.bg} />}
      </View>

      <View style={styles.labelContainer}>{children}</View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    alignSelf: "center",
  },
  labelContainer: {
    flex: 1,
  },

  box: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: colors.accent,
    borderRadius: 4,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  boxChecked: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
});
