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

import Svg, { Circle } from "react-native-svg";
import SavePresetModal from "../../components/modal/TimePreset";
import { DEFAULT_PRESETS, Preset } from "../../types/preset";
import PresetCard from "../../components/cards/PresetCard";
import { Ionicons } from "@expo/vector-icons";
import {
  useFocusLogs,
  useSaveFocusSession,
} from "../../service/hooks/useFocusLogs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../styles/theme";
import Entypo from "@expo/vector-icons/Entypo";
import { formatLogDate } from "../../utils/dateFormatter";
import { useAudioPlayer } from "expo-audio";
import { getDeletedPresetIds, markPresetDeleted } from "../../lib/deletePreset";

type TimerState = "idle" | "running" | "paused";

export default function FocusScreen() {
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const savedRef = useRef(false);
  const insets = useSafeAreaInsets();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startMinsRef = useRef(25);

  const [focusLabel, setFocusLabel] = useState("");
  const [selectedMins, setSelectedMins] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const totalSecsRef = useRef(25 * 60);

  const [editingTimer, setEditingTimer] = useState(false);
  const [timerInput, setTimerInput] = useState("25:00");

  const [showPresetModal, setShowPresetModal] = useState(false);

  const [presets, setPresets] = useState<Preset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [editingPreset, setEditingPreset] = useState<Preset | null>(null);

  const player = useAudioPlayer(require("../../assets/alarm.mp3"));

  const { data: sessions, isLoading } = useFocusLogs();
  const saveMutation = useSaveFocusSession();
  const isRunning = timerState === "running";
  const totalItems = presets.length + 1;
  const ghostCount = (3 - (totalItems % 3)) % 3;

  useEffect(() => {
    if (timerState === "running") {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setTimerState("idle");
            handleSessionComplete();
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

  useEffect(() => {
    getDeletedPresetIds().then((deletedIds) => {
      setPresets(DEFAULT_PRESETS.filter((p) => !deletedIds.includes(p.id)));
    });
  }, []);

  async function handleSessionComplete() {
    if (savedRef.current) return;
    savedRef.current = true;

    if (startMinsRef.current >= 5) {
      saveMutation.mutate({
        label: focusLabel.trim() || "Focus Session",
        durationMins: startMinsRef.current,
        completed: true,
      });
    }

    player.play();
    Alert.alert("🎉 Done!", "Focus session complete!", [
      {
        text: "OK",
        onPress: () => {
          player.pause();
          setTimerState("idle");
          setSecondsLeft(totalSecsRef.current);
          setFocusLabel("");
          setSelectedPresetId(null);
          setSelectedMins(totalSecsRef.current / 60);
          savedRef.current = false;
        },
      },
    ]);
  }

  function handleSelectPreset(preset: Preset) {
    setSelectedPresetId(preset.id);
    const secs = preset.durationSecs;
    setSecondsLeft(secs);
    totalSecsRef.current = secs;
    startMinsRef.current = Math.ceil(secs / 60);
    setSelectedMins(secs / 60);
    setFocusLabel(preset.name);
  }

  async function handleDeletePreset(id: string) {
    if (id.startsWith("default-")) {
      await markPresetDeleted(id);
    }
    setPresets((prev) => prev.filter((p) => p.id !== id));
    if (selectedPresetId === id) setSelectedPresetId(null);
  }

  function handleSavePreset(data: {
    name: string;
    icon: string;
    durationSecs: number;
  }) {
    if (editingPreset) {
      setPresets((prev) =>
        prev.map((p) => (p.id === editingPreset.id ? { ...p, ...data } : p)),
      );
      setEditingPreset(null);
    } else {
      const newPreset: Preset = {
        id: `preset-${Date.now()}`,
        ...data,
      };
      setPresets((prev) => [...prev, newPreset]);
    }
    setShowPresetModal(false);
  }

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
    setSecondsLeft(totalSecsRef.current);
  }

  function handleAbandon() {
    const elapsed = startMinsRef.current - Math.ceil(secondsLeft / 60);
    if (elapsed >= 5) {
      saveMutation.mutate({
        label: focusLabel.trim() || "Focus Session",
        durationMins: elapsed,
        completed: false,
      });
    }
    handleReset();
  }

  const SIZE = 220;
  const RADIUS = 90;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const totalSeconds = totalSecsRef.current;
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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        padding: 20,
        paddingTop: insets.top + 20,
        paddingBottom: insets.bottom + 90,
      }}
      onScrollBeginDrag={() => setActivePresetId(null)}
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
        <Text style={styles.title}>Focus</Text>
      </View>
      {/* Timer Card */}
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="e.g., Creating, Learning, Deep Work..."
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
              stroke={colors.accent}
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

                  const [m, s] = val.split(":").map(Number);
                  if (!isNaN(m) && !isNaN(s)) {
                    const total = m * 60 + s;
                    if (total > 0) {
                      setSecondsLeft(total);
                      totalSecsRef.current = total;
                      startMinsRef.current = Math.ceil(total / 60);
                      setSelectedMins(total / 60);
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

            {isRunning || timerState === "paused" ? (
              <Text style={styles.timerLabel} numberOfLines={1}>
                {selectedMins >= 1
                  ? `${Math.ceil(selectedMins)} ${Math.ceil(selectedMins) === 1 ? "min" : "mins"}`
                  : `${Math.round(selectedMins * 60)} secs`}
              </Text>
            ) : (
              <Text style={styles.timerLabel}>Tap time to edit</Text>
            )}
          </View>
        </View>

        {/* Presets */}

        <View style={styles.presetsRow}>
          {presets.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              disabled={isRunning}
              isSelected={selectedPresetId === preset.id}
              showActions={activePresetId === preset.id}
              onLongPress={() => !isRunning && setActivePresetId(preset.id)}
              onPress={() => {
                if (isRunning) return;
                setActivePresetId(null);
                handleSelectPreset(preset);
              }}
              onEdit={() => {
                if (isRunning) return;
                setActivePresetId(null);
                setEditingPreset(preset);
                setShowPresetModal(true);
              }}
              onDelete={() => {
                if (isRunning) return;
                setActivePresetId(null);
                handleDeletePreset(preset.id);
              }}
            />
          ))}

          {/* Add button */}
          <TouchableOpacity
            style={styles.addpresetBtn}
            disabled={isRunning}
            onPress={() => {
              setEditingPreset(null);
              setShowPresetModal(true);
            }}
          >
            <Ionicons name="add" size={24} color="#888" />
            <Text style={styles.addPresetText}>New</Text>
          </TouchableOpacity>
          {/* ghost fillers — invisible but push last row to the left */}
          {Array.from({ length: ghostCount }).map((_, i) => (
            <View
              key={`ghost-${i}`}
              style={[styles.addpresetBtn, { opacity: 0 }]}
            />
          ))}
        </View>

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
      <Text style={styles.sectionHeader}>Previous Sessions</Text>
      {isLoading ? (
        <ActivityIndicator color={colors.accent} />
      ) : sessions?.length === 0 ? (
        <Text style={styles.empty}>No sessions yet</Text>
      ) : (
        sessions?.map((session) => (
          <View key={session.id} style={styles.logCard}>
            <View style={styles.logIcon}>
              <Entypo name="check" size={20} color={colors.accent} />
            </View>
            <View style={styles.logTitleRow}>
              <Text style={styles.logLabel}>{session.label}</Text>
              <View style={styles.logMetaRow}>
                <Text style={styles.logMetaText}>
                  {session.durationMins} min
                </Text>
                <Text style={styles.logDot}>•</Text>
                <Text style={styles.logMetaText}>
                  {new Date(session.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
                <Text style={styles.logDot}>•</Text>
                <Text style={styles.logDate}>
                  {formatLogDate(session.logDay)}
                </Text>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  logDot: { fontSize: 12, color: "#555" },
  logDate: { fontSize: 11, color: "#555", marginTop: 0 },
  logMetaRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  logMeta: { flexDirection: "row", color: "#888", gap: 8 },
  logMetaText: { fontSize: 11, color: "#888" },

  content: { padding: 20, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },
  logCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 24,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",

    gap: 10,
  },
  logIcon: {
    width: 40,
    height: 40,
    backgroundColor: colors.accentBlur,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  title: { fontSize: 24, fontWeight: "800", color: "#fff" },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,

    borderColor: colors.border,
    gap: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  cardTitle: { fontSize: 14, color: "#888", alignSelf: "flex-start" },
  input: {
    backgroundColor: colors.bgIconContainer,
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
    flexWrap: "wrap",
    gap: 8,
    width: "100%",
    justifyContent: "center",
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
    backgroundColor: colors.accent,
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  primaryBtnText: { color: "#000", fontWeight: "700", fontSize: 15 },
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

  logRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  logTitleRow: {
    flexDirection: "column",
    alignItems: "flex-start",
    alignSelf: "center",
    flex: 1,
  },
  logLabel: { fontSize: 14, fontWeight: "700", color: "#fff" },

  deleteBtn: { padding: 8 },
  deleteText: { color: "#ff4d4d", fontSize: 16 },
});
