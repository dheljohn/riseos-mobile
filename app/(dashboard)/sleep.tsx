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
import Slider from "@react-native-community/slider";
import DatePickerField from "../../components/DatePicker";
import {
  useAddSleepLog,
  useDeleteSleepLog,
  useSleepLog,
} from "../../service/hooks/useSleepLogs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../styles/theme";
import { BatteryWarning, Frown, Meh, Smile, Zap } from "lucide-react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { formatLogDate } from "../../utils/dateFormatter";
const ENERGY_OPTIONS = [
  { value: 1, icon: BatteryWarning, label: "Exhausted" },
  { value: 2, icon: Frown, label: "Tired" },
  { value: 3, icon: Meh, label: "Okay" },
  { value: 4, icon: Smile, label: "Great" },
  { value: 5, icon: Zap, label: "Energized" },
];

export default function SleepScreen() {
  const [durationHrs, setDurationHrs] = useState(8);
  const [energyLevel, setEnergyLevel] = useState(3);
  const [logDay, setLogDay] = useState(new Date().toLocaleDateString("en-CA"));

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
        paddingTop: insets.top + 20,
        paddingBottom: insets.bottom + 90,
      }}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Sleep Tracker</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.formTitle}>How was your sleep?</Text>

        {/* Duration */}
        <DatePickerField label="Date" value={logDay} onChange={setLogDay} />
        <View style={styles.fieldGroup}>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>How long did you sleep?</Text>
            <Text style={styles.fieldValueH}>{durationHrs}h</Text>
          </View>

          <Slider
            minimumValue={1}
            maximumValue={12}
            step={0.5}
            value={durationHrs}
            onValueChange={setDurationHrs}
            minimumTrackTintColor={colors.accent}
            thumbTintColor={colors.accent}
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
            <Text style={styles.fieldLabel}>How are you feeling?</Text>
            <Text style={styles.fieldValue}>{selectedEnergy?.label}</Text>
          </View>
          <View style={styles.energyRow}>
            {ENERGY_OPTIONS.map((energy) => {
              const Icon = energy.icon;

              return (
                <TouchableOpacity
                  key={energy.value}
                  style={[
                    styles.energyBtn,
                    energyLevel === energy.value && styles.energyBtnActive,
                  ]}
                  onPress={() => setEnergyLevel(energy.value)}
                >
                  <Icon size={22} color={colors.accent} />
                </TouchableOpacity>
              );
            })}
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
        <ActivityIndicator color={colors.accent} />
      ) : logs?.length === 0 ? (
        <Text style={styles.empty}>No sleep logs yet</Text>
      ) : (
        logs?.map((log) => {
          const energy = ENERGY_OPTIONS.find(
            (e) => e.value === log.energyLevel,
          );

          const Icon = energy?.icon;

          return (
            <View key={log.id} style={styles.logCard}>
              <View style={styles.logIcon}>
                {Icon && <Icon size={24} color={colors.accent} />}
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.logValue}>{log.durationHrs}h</Text>
                  <View style={styles.row}>
                    <Text style={styles.logSub}>{energy?.label}</Text>
                    <Text style={styles.logDot}>•</Text>

                    <Text style={styles.logDate}>
                      {formatLogDate(log.logDay)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => confirmDelete(log.id)}
                  style={styles.deleteBtn}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={colors.delete}
                  />
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
  container: { flex: 1, backgroundColor: colors.bg },

  row: {
    flexDirection: "row",
    alignItems: "baseline",
    alignSelf: "baseline",
    gap: 8,
  },
  content: { padding: 20, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },
  title: { fontSize: 24, fontWeight: "800", color: "#fff" },
  form: {
    backgroundColor: colors.bgCard,
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
  fieldValueH: { fontSize: 25, fontWeight: "700", color: "#fff" },
  fieldValue: { fontSize: 15, fontWeight: "700", color: "#fff" },
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
    backgroundColor: colors.bgIconContainer,
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  energyBtnActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentBg,
  },
  energyEmoji: { fontSize: 32 },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  buttonText: { color: "#020305", fontWeight: "700", fontSize: 15 },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
  },
  empty: { color: "#555", fontSize: 14, textAlign: "center", marginTop: 20 },
  logCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 24,
    padding: 8,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: 12,
  },
  logIcon: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: colors.accentBlur,
    alignItems: "center",
    justifyContent: "center",
  },

  logRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  logEmoji: { fontSize: 32 },
  logValue: { fontSize: 18, fontWeight: "700", color: "#fff" },
  logSub: { fontSize: 12, color: "#888", marginTop: 0 },
  logDot: { fontSize: 12, color: "#555" },
  logDate: { fontSize: 11, color: "#555", marginTop: 0 },
  deleteBtn: { padding: 8 },
  deleteText: { color: "#ff4d4d", fontSize: 16 },
});
