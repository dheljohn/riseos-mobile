import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
  StyleSheet,
} from "react-native";
import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../styles/theme";

interface Props {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

function formatDisplay(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toDateString(date: Date): string {
  return date.toLocaleDateString("en-CA");
}

export default function DatePickerField({ label, value, onChange }: Props) {
  const [show, setShow] = useState(false);
  const selected = value ? new Date(value + "T00:00:00") : new Date();

  const handleAndroidChange = (e: DateTimePickerEvent, date?: Date) => {
    setShow(false);
    if (e.type === "dismissed" || !date) return;
    onChange(toDateString(date));
  };

  const handleIOSChange = (_: DateTimePickerEvent, date?: Date) => {
    if (!date) return;
    onChange(toDateString(date));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.button} onPress={() => setShow(true)}>
        <Ionicons
          name="calendar-clear-outline"
          size={24}
          color={colors.accent}
        />
        <Text style={styles.buttonText}>
          {value ? formatDisplay(value) : "Pick a date"}
        </Text>
      </TouchableOpacity>

      {Platform.OS === "android" ? (
        <>
          {show && (
            <RNDateTimePicker
              value={selected}
              mode="date"
              display="default"
              onChange={handleAndroidChange}
              maximumDate={new Date()}
            />
          )}
        </>
      ) : (
        <Modal visible={show} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{label}</Text>
              <RNDateTimePicker
                value={selected}
                mode="date"
                display="spinner"
                onChange={handleIOSChange}
                maximumDate={new Date()}
                style={styles.picker}
                textColor="#000"
              />
              <View style={styles.modalActions}>
                <TouchableOpacity onPress={() => setShow(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShow(false)}>
                  <Text style={styles.confirmText}>Done ✓</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 4 },
  label: { fontSize: 13, color: "#888", marginBottom: 6 },
  button: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.bgIconContainer,
    gap: 8,
  },
  calendarIcon: { fontSize: 16 },
  buttonText: { fontSize: 15, color: "#fff" },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    color: "#111827",
  },
  picker: { width: "100%" },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  cancelText: { fontSize: 16, color: "#6b7280" },
  confirmText: { fontSize: 16, fontWeight: "700", color: "#6c63ff" },
});
