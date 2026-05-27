import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import Slider from "@react-native-community/slider";
import DatePickerField from "../../components/DatePicker";
import {
  useAddSleepLog,
  useDeleteSleepLog,
  useSleepLog,
} from "../../service/hooks/useSleepLogs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ENERGY_OPTIONS = [
  { value: 1, emoji: "😴", label: "Exhausted" },
  { value: 2, emoji: "😕", label: "Low" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "🔥", label: "Energized" },
];

export default function SleepScreen() {
  const [durationHrs, setDurationHrs] = useState(8);
  const [energyLevel, setEnergyLevel] = useState(3);
  const [logDay, setLogDay] = useState(
    new Date().toLocaleDateString("en-CA"), // "YYYY-MM-DD" in local time
  );

  const { data: logs, isLoading } = useSleepLog();
  const insets = useSafeAreaInsets();

  const addMutation = useAddSleepLog(() => {
    setDurationHrs(8);
    setEnergyLevel(3);
  });

  const deleteMutation = useDeleteSleepLog();

  function confirmDelete(id: string) {
    Alert.alert("Delete", "Remove this sleep log?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteMutation.mutate(id),
      },
    ]);
  }

  const selectedEnergy = ENERGY_OPTIONS.find((e) => e.value === energyLevel);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        padding: 20,
        paddingTop: insets.top + 20, // ← respects status bar
        paddingBottom: insets.bottom + 90, // ← respects home indicator + nav bar
      }}
      //  contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Sleep Tracker</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.formTitle}>How was your sleep?</Text>

        {/* Duration */}
        <DatePickerField label="Date" value={logDay} onChange={setLogDay} />
        <View style={styles.fieldGroup}>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Sleep Duration</Text>
            <Text style={styles.fieldValue}>{durationHrs}h</Text>
          </View>
          {/* Slider substitute — step buttons */}
          {/* <View style={styles.sliderRow}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => setDurationHrs((v) => Math.max(1, v - 0.5))}
            >
              <Text style={styles.stepBtnText}>−</Text>
            </TouchableOpacity>
            <View style={styles.sliderTrack}>
              <View
                style={[
                  styles.sliderFill,
                  { width: `${((durationHrs - 1) / 11) * 100}%` },
                ]}
              />
            </View>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => setDurationHrs((v) => Math.min(12, v + 0.5))}
            >
              <Text style={styles.stepBtnText}>+</Text>
            </TouchableOpacity>
          </View> */}
          <Slider
            minimumValue={1}
            maximumValue={12}
            step={0.5}
            value={durationHrs}
            onValueChange={setDurationHrs}
            minimumTrackTintColor="#6c63ff"
            maximumTrackTintColor="#2a2a2a"
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabelText}>1h</Text>
            <Text style={styles.sliderLabelText}>12h</Text>
          </View>
        </View>

        {/* Energy Level */}
        <View style={styles.fieldGroup}>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Energy Level</Text>
            <Text style={styles.fieldValue}>{selectedEnergy?.label}</Text>
          </View>
          <View style={styles.energyRow}>
            {ENERGY_OPTIONS.map((energy) => (
              <TouchableOpacity
                key={energy.value}
                style={[
                  styles.energyBtn,
                  energyLevel === energy.value && styles.energyBtnActive,
                ]}
                onPress={() => setEnergyLevel(energy.value)}
              >
                <Text style={styles.energyEmoji}>{energy.emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            addMutation.mutate({ durationHrs, energyLevel, logDay })
          }
          disabled={addMutation.isPending}
        >
          {addMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save Sleep Log</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Logs */}
      <Text style={styles.sectionHeader}>Previous Logs</Text>
      {isLoading ? (
        <ActivityIndicator color="#6c63ff" />
      ) : logs?.length === 0 ? (
        <Text style={styles.empty}>No sleep logs yet</Text>
      ) : (
        logs?.map((log) => {
          const energy = ENERGY_OPTIONS.find(
            (e) => e.value === log.energyLevel,
          );
          return (
            <View key={log.id} style={styles.logCard}>
              <View style={styles.logRow}>
                <Text style={styles.logEmoji}>{energy?.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.logValue}>{log.durationHrs}h sleep</Text>
                  <Text style={styles.logSub}>{energy?.label}</Text>
                  <Text style={styles.logDate}>
                    {new Date(log.logDay + "T00:00:00").toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => confirmDelete(log.id)}
                  style={styles.deleteBtn}
                >
                  <Text style={styles.deleteText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f0f" },
  content: { padding: 20, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },
  back: { color: "#6c63ff", fontSize: 15 },
  title: { fontSize: 24, fontWeight: "800", color: "#fff" },
  form: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    gap: 16,
    marginBottom: 24,
  },
  formTitle: { fontSize: 16, fontWeight: "700", color: "#fff" },
  fieldGroup: { gap: 8 },
  fieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fieldLabel: { fontSize: 13, color: "#888" },
  fieldValue: { fontSize: 18, fontWeight: "700", color: "#fff" },
  sliderRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  stepBtn: {
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBtnText: { color: "#fff", fontSize: 20, fontWeight: "600" },
  sliderTrack: {
    flex: 1,
    height: 6,
    backgroundColor: "#2a2a2a",
    borderRadius: 3,
    overflow: "hidden",
  },
  sliderFill: { height: "100%", backgroundColor: "#6c63ff", borderRadius: 3 },
  sliderLabels: { flexDirection: "row", justifyContent: "space-between" },
  sliderLabelText: { fontSize: 11, color: "#555" },
  energyRow: { flexDirection: "row", gap: 4 },
  energyBtn: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  energyBtnActive: { borderColor: "#6c63ff", backgroundColor: "#1e1b4b" },
  energyEmoji: { fontSize: 22 },
  button: {
    backgroundColor: "#6c63ff",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
  },
  empty: { color: "#555", fontSize: 14, textAlign: "center", marginTop: 20 },
  logCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    marginBottom: 10,
  },
  logRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  logEmoji: { fontSize: 32 },
  logValue: { fontSize: 15, fontWeight: "700", color: "#fff" },
  logSub: { fontSize: 12, color: "#888", marginTop: 2 },
  logDate: { fontSize: 11, color: "#555", marginTop: 4 },
  deleteBtn: { padding: 8 },
  deleteText: { color: "#ff4d4d", fontSize: 16 },
});
