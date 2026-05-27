import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Preset } from "../types/preset";

interface PresetCardProps {
  preset: Preset;
  isSelected: boolean;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function formatDuration(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (s > 0) return `${m}m ${s}s`;
  return `${m}m`;
}

export default function PresetCard({
  preset,
  isSelected,
  onPress,
  onEdit,
  onDelete,
}: PresetCardProps) {
  const [showActions, setShowActions] = useState(false);

  function handleLongPress() {
    setShowActions(true);
  }

  function handleEdit() {
    setShowActions(false);
    onEdit();
  }

  function handleDelete() {
    setShowActions(false);
    onDelete();
  }

  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardActive]}
      onPress={() => {
        setShowActions(false);
        onPress();
      }}
      onLongPress={handleLongPress}
      delayLongPress={400}
      activeOpacity={0.8}
    >
      {showActions ? (
        // Long press action overlay
        <View style={styles.actionsOverlay}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleEdit}>
            <Ionicons name="pencil-outline" size={16} color="#6c63ff" />
          </TouchableOpacity>
          <View style={styles.actionDivider} />
          <TouchableOpacity style={styles.actionBtn} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={16} color="#ff4d4d" />
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={[styles.iconBox, isSelected && styles.iconBoxActive]}>
            <Ionicons
              name={preset.icon as any}
              size={18}
              color={isSelected ? "#fff" : "#6c63ff"}
            />
          </View>
          <Text
            style={[styles.name, isSelected && styles.nameActive]}
            numberOfLines={1}
          >
            {preset.name}
          </Text>
          <Text style={styles.duration}>
            {formatDuration(preset.durationSecs)}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    padding: 12,
    alignItems: "center",
    gap: 6,
    width: "30%",
    minHeight: 90,
    justifyContent: "center",
  },
  cardActive: {
    borderColor: "#6c63ff",
    backgroundColor: "#1e1b4b",
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBoxActive: { backgroundColor: "#6c63ff" },
  name: { fontSize: 11, color: "#aaa", textAlign: "center", fontWeight: "600" },
  nameActive: { color: "#fff" },
  duration: { fontSize: 10, color: "#666" },

  // Actions overlay
  actionsOverlay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    width: "100%",
    justifyContent: "center",
  },
  actionBtn: {
    alignItems: "center",
    gap: 4,
    padding: 4,
    flex: 1,
  },
  actionDivider: { width: 1, height: 30, backgroundColor: "#2a2a2a" },
  actionEditText: { fontSize: 10, color: "#6c63ff", fontWeight: "600" },
  actionDeleteText: { fontSize: 10, color: "#ff4d4d", fontWeight: "600" },
});
