import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { router } from "expo-router";
import Svg, { Circle } from "react-native-svg";
import SavePresetModal from "../../components/modal/TimePreset";
import { DEFAULT_PRESETS, Preset } from "../../components/types/preset";
import PresetCard from "../../components/cards/PresetCard";
import { Ionicons } from "@expo/vector-icons";
import {
  useDeleteFocusSession,
  useFocusLogs,
  useSaveFocusSession,
} from "../../service/hooks/useFocusLogs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// const PRESETS = [25, 60, 90];
type TimerState = "idle" | "running" | "paused";

export default function FocusScreen() {
  const savedRef = useRef(false);
  const insets = useSafeAreaInsets();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startMinsRef = useRef(25);

  const [focusLabel, setFocusLabel] = useState("");
  const [selectedMins, setSelectedMins] = useState(25);
  const [customInput, setCustomInput] = useState("25");
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [timerState, setTimerState] = useState<TimerState>("idle");

  const [editingTimer, setEditingTimer] = useState(false);
  const [timerInput, setTimerInput] = useState("25:00");

  const [showPresetModal, setShowPresetModal] = useState(false);

  const [presets, setPresets] = useState<Preset[]>(DEFAULT_PRESETS);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [editingPreset, setEditingPreset] = useState<Preset | null>(null);

  const { data: sessions, isLoading } = useFocusLogs();
  const saveMutation = useSaveFocusSession();
  const deleteMutation = useDeleteFocusSession();

  // Countdown tick
  useEffect(() => {
    if (timerState === "running") {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setTimerState("idle");
            if (!savedRef.current) {
              savedRef.current = true;
              saveMutation.mutate({
                label: focusLabel.trim() || "Focus Session",
                durationMins: startMinsRef.current,
                completed: true,
              });
              Alert.alert("🎉 Done!", "Focus session complete!");
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerState]);

  function handleSelectPreset(preset: Preset) {
    setSelectedPresetId(preset.id);
    const secs = preset.durationSecs;
    setSecondsLeft(secs);
    startMinsRef.current = Math.ceil(secs / 60);
    setSelectedMins(Math.ceil(secs / 60));
    setFocusLabel(preset.name);
  }

  function handleDeletePreset(id: string) {
    // don't allow deleting if only 1 left
    if (presets.length <= 1) return;
    setPresets((prev) => prev.filter((p) => p.id !== id));
    if (selectedPresetId === id) setSelectedPresetId(null);
  }

  function handleSavePreset(data: {
    name: string;
    icon: string;
    durationSecs: number;
  }) {
    if (editingPreset) {
      // editing existing
      setPresets((prev) =>
        prev.map((p) => (p.id === editingPreset.id ? { ...p, ...data } : p)),
      );
      setEditingPreset(null);
    } else {
      // adding new

      const newPreset: Preset = {
        id: `preset-${Date.now()}`,
        ...data,
      };
      setPresets((prev) => [...prev, newPreset]);
    }
    setShowPresetModal(false);
  }

  // function applyMins(mins: number) {
  //   if (timerState !== "idle") return;
  //   setSelectedMins(mins);
  //   setCustomInput(String(mins));
  //   setSecondsLeft(mins * 60);
  //   startMinsRef.current = mins;
  // }

  // function handleCustomInput(val: string) {
  //   setCustomInput(val);
  //   const parsed = parseInt(val);
  //   if (!isNaN(parsed) && parsed > 0 && timerState === "idle") {
  //     setSelectedMins(parsed);
  //     setSecondsLeft(parsed * 60);
  //     startMinsRef.current = parsed;
  //   }
  // }

  function handleStartPause() {
    if (timerState === "idle") {
      if (secondsLeft === 0) setSecondsLeft(startMinsRef.current * 60);
      savedRef.current = false;
      setTimerState("running");
    } else if (timerState === "running") {
      setTimerState("paused");
    } else {
      setTimerState("running");
    }
  }

  function handleReset() {
    setTimerState("idle");
    setSecondsLeft(startMinsRef.current * 60);
  }

  function handleAbandon() {
    const elapsed = startMinsRef.current - Math.ceil(secondsLeft / 60);
    if (elapsed >= 1) {
      saveMutation.mutate({
        label: focusLabel.trim() || "Focus Session",
        durationMins: elapsed,
        completed: false,
      });
    }
    handleReset();
  }

  // Circle timer math
  const SIZE = 220;
  const RADIUS = 90;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const totalSeconds = startMinsRef.current * 60;
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 1;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  const mins = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const secs = (secondsLeft % 60).toString().padStart(2, "0");

  const startBtnLabel =
    timerState === "idle"
      ? "Start"
      : timerState === "running"
        ? "Pause"
        : "Continue";

  function confirmDelete(id: string) {
    Alert.alert("Delete", "Remove this session?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteMutation.mutate(id),
      },
    ]);
  }

  return (
    <ScrollView
      style={styles.container}
      //  contentContainerStyle={styles.content}
      contentContainerStyle={{
        padding: 20,
        paddingTop: insets.top + 20, // ← respects status bar
        paddingBottom: insets.bottom + 90, // ← respects home indicator + nav bar
      }}
    >
      <SavePresetModal
        visible={showPresetModal}
        onClose={() => {
          setShowPresetModal(false);
          setEditingPreset(null);
        }}
        onSave={handleSavePreset}
        initialValues={
          editingPreset
            ? {
                name: editingPreset.name,
                icon: editingPreset.icon,
                durationSecs: editingPreset.durationSecs,
              }
            : null
        }
      />

      {/* Header */}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Focus</Text>
      </View>
      {/* Timer Card */}
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="e.g. Coding, Reading, Deep Work..."
          placeholderTextColor="#555"
          value={focusLabel}
          onChangeText={setFocusLabel}
          editable={timerState === "idle"}
        />

        {/* Circle Timer */}
        <View style={styles.timerContainer}>
          <Svg width={SIZE} height={SIZE}>
            {/* Background ring */}
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="#2a2a2a"
              strokeWidth={10}
            />
            {/* Progress ring */}
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="#6c63ff"
              strokeWidth={10}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              rotation="-90"
              origin={`${SIZE / 2}, ${SIZE / 2}`}
            />
          </Svg>
          <View style={styles.timerOverlay}>
            {editingTimer && timerState === "idle" ? (
              <TextInput
                style={styles.timerText}
                value={timerInput}
                onChangeText={(val) => {
                  setTimerInput(val);
                  // parse MM:SS input in real time
                  const [m, s] = val.split(":").map(Number);
                  if (!isNaN(m) && !isNaN(s)) {
                    const total = m * 60 + s;
                    if (total > 0) {
                      setSecondsLeft(total);
                      startMinsRef.current = Math.ceil(total / 60);
                      setSelectedMins(Math.ceil(total / 60));
                    }
                  }
                }}
                onBlur={() => setEditingTimer(false)}
                keyboardType="numbers-and-punctuation"
                autoFocus
                maxLength={5}
                selectTextOnFocus
              />
            ) : (
              <TouchableOpacity
                onPress={() => {
                  if (timerState === "idle") {
                    setTimerInput(`${mins}:${secs}`);
                    setEditingTimer(true);
                  }
                }}
              >
                <Text style={styles.timerText}>
                  {mins}:{secs}
                </Text>
              </TouchableOpacity>
            )}

            {focusLabel ? (
              <Text style={styles.timerLabel} numberOfLines={1}>
                {focusLabel}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Presets */}

        <View style={styles.presetsRow}>
          {presets.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              isSelected={selectedPresetId === preset.id}
              onPress={() => handleSelectPreset(preset)}
              onEdit={() => {
                setEditingPreset(preset);
                setShowPresetModal(true);
              }}
              onDelete={() => handleDeletePreset(preset.id)}
            />
          ))}

          {/* Add button */}
          <TouchableOpacity
            style={styles.addpresetBtn}
            onPress={() => {
              setEditingPreset(null);
              setShowPresetModal(true);
            }}
          >
            <Ionicons name="add" size={24} color="#888" />
            <Text style={styles.addPresetText}>New</Text>
          </TouchableOpacity>
        </View>

        {/* Custom Input */}
        {/* <View style={styles.customRow}>
          <TextInput
            style={styles.customInput}
            value={customInput}
            onChangeText={handleCustomInput}
            keyboardType="numeric"
            editable={timerState === "idle"}
          />
          <Text style={styles.customLabel}>min</Text>
        </View> */}

        {/* Controls */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleStartPause}
          >
            <Text style={styles.primaryBtnText}>{startBtnLabel}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={timerState !== "idle" ? handleAbandon : handleReset}
          >
            <Text style={styles.secondaryBtnText}>
              {timerState !== "idle" ? "Abandon" : "Reset"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Sessions Log */}
      <Text style={styles.sectionHeader}>Today's Sessions</Text>
      {isLoading ? (
        <ActivityIndicator color="#6c63ff" />
      ) : sessions?.length === 0 ? (
        <Text style={styles.empty}>No sessions yet today</Text>
      ) : (
        sessions?.map((session) => (
          <View key={session.id} style={styles.logCard}>
            <View style={styles.logRow}>
              <View style={{ flex: 1 }}>
                <View style={styles.logTitleRow}>
                  <Text style={styles.logLabel}>{session.label}</Text>
                  <Text>{session.completed ? "✅" : "❌"}</Text>
                </View>
                <Text style={styles.logMeta}>
                  {session.durationMins} min ·{" "}
                  {new Date(session.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => confirmDelete(session.id)}
                style={styles.deleteBtn}
              >
                <Text style={styles.deleteText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
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
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,

    borderColor: "#2a2a2a",
    gap: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  cardTitle: { fontSize: 14, color: "#888", alignSelf: "flex-start" },
  input: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontSize: 14,
    width: "100%",
  },
  timerContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  timerOverlay: {
    position: "absolute",
    alignItems: "center",
  },
  timerText: {
    fontSize: 40,
    fontWeight: "800",
    color: "#fff",
    fontVariant: ["tabular-nums"],
  },
  timerLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
    maxWidth: 120,
    textAlign: "center",
  },
  presetsRow: {
    flexDirection: "row",
    flexWrap: "wrap", // ← wraps to next row
    gap: 8,
    width: "100%",
    justifyContent: "space-between",
  },
  addPresetText: { fontSize: 11, color: "#888" },
  addpresetBtn: {
    width: "30%",
    minHeight: 90,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  presetBtn: {
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  presetBtnActive: { backgroundColor: "#6c63ff", borderColor: "#6c63ff" },
  presetBtnText: { color: "#888", fontSize: 13 },
  presetBtnTextActive: { color: "#fff", fontWeight: "700" },
  customRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  customInput: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 8,
    padding: 10,
    color: "#fff",
    fontSize: 14,
    width: 70,
    textAlign: "center",
  },
  customLabel: { color: "#888", fontSize: 14 },
  controlsRow: { flexDirection: "row", gap: 10, width: "100%" },
  primaryBtn: {
    flex: 1,
    backgroundColor: "#6c63ff",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  secondaryBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  secondaryBtnText: { color: "#aaa", fontWeight: "600", fontSize: 15 },
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
  logRow: { flexDirection: "row", alignItems: "center" },
  logTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  logLabel: { fontSize: 14, fontWeight: "700", color: "#fff" },
  logMeta: { fontSize: 12, color: "#888" },
  deleteBtn: { padding: 8 },
  deleteText: { color: "#ff4d4d", fontSize: 16 },
});
