import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../styles/theme";

const ICON_OPTIONS: Array<keyof typeof Ionicons.glyphMap> = [
  "book-outline",
  "code-slash-outline",
  "barbell-outline",
  "musical-notes-outline",
  "brush-outline",
  "flask-outline",
  "laptop-outline",
  "pencil-outline",
  "calculator-outline",
  "mic-outline",
];

interface PresetForm {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  hours: string;
  minutes: string;
  seconds: string;
}

interface SavePresetModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (preset: {
    name: string;
    icon: string;
    durationSecs: number;
  }) => void;
  initialValues?: { name: string; icon: string; durationSecs: number } | null;
  isEditing?: boolean;
}

export default function SavePresetModal({
  visible,
  onClose,
  onSave,
  initialValues,
  isEditing = false,
}: SavePresetModalProps) {
  const [form, setForm] = useState<PresetForm>({
    name: "",
    icon: "book-outline",
    hours: "00",
    minutes: "25",
    seconds: "00",
  });
  const [errors, setErrors] = useState({ name: "", duration: "" });
  useEffect(() => {
    if (initialValues) {
      const h = Math.floor(initialValues.durationSecs / 3600);
      const m = Math.floor((initialValues.durationSecs % 3600) / 60);
      const s = initialValues.durationSecs % 60;
      setForm({
        name: initialValues.name,
        icon: initialValues.icon as any,
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    } else {
      setForm({
        name: "",
        icon: "book-outline",
        hours: "00",
        minutes: "25",
        seconds: "00",
      });
    }
    setErrors({ name: "", duration: "" });
  }, [initialValues, visible]);

  function handleSave() {
    const h = parseInt(form.hours) || 0;
    const m = parseInt(form.minutes) || 0;
    const s = parseInt(form.seconds) || 0;
    const durationSecs = h * 3600 + m * 60 + s;

    const newErrors = { name: "", duration: "" };
    if (!form.name.trim()) newErrors.name = "Label is required";
    if (durationSecs <= 4)
      newErrors.duration = "Duration must be greater than 5 seconds";

    if (newErrors.name || newErrors.duration) {
      setErrors(newErrors);
      return;
    }

    setErrors({ name: "", duration: "" });

    if (!form.name.trim()) return;
    if (durationSecs === 0) return;

    onSave({ name: form.name, icon: form.icon, durationSecs });
    onClose();
  }

  function handleTimeInput(
    field: "hours" | "minutes" | "seconds",
    val: string,
  ) {
    const cleaned = val.replace(/[^0-9]/g, "").slice(0, 2);
    setForm((prev) => ({ ...prev, [field]: cleaned }));
  }

  function formatOnBlur(field: "hours" | "minutes" | "seconds") {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].padStart(2, "0"),
    }));
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          <Text style={styles.title}>
            {isEditing ? "Edit Preset" : "Save Preset"}
          </Text>

          {/* Name */}
          <Text style={styles.label}>Label</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Deep Work, Reading..."
            placeholderTextColor="#555"
            value={form.name}
            onChangeText={(val) => {
              setForm((prev) => ({ ...prev, name: val }));
              if (val.trim()) setErrors((prev) => ({ ...prev, name: "" }));
            }}
          />
          {errors.name ? (
            <Text style={styles.errorText}>{errors.name}</Text>
          ) : null}

          {/* Duration */}
          <Text style={styles.label}>Duration</Text>
          <View style={styles.durationRow}>
            <View style={styles.timeField}>
              <TextInput
                style={styles.timeInput}
                value={form.hours}
                onChangeText={(val) => handleTimeInput("hours", val)}
                onBlur={() => formatOnBlur("hours")}
                keyboardType="number-pad"
                maxLength={2}
                selectTextOnFocus
              />
              <Text style={styles.timeUnit}>h</Text>
            </View>

            <Text style={styles.timeSep}>:</Text>

            <View style={styles.timeField}>
              <TextInput
                style={styles.timeInput}
                value={form.minutes}
                onChangeText={(val) => handleTimeInput("minutes", val)}
                onBlur={() => formatOnBlur("minutes")}
                keyboardType="number-pad"
                maxLength={2}
                selectTextOnFocus
              />
              <Text style={styles.timeUnit}>m</Text>
            </View>

            <Text style={styles.timeSep}>:</Text>

            <View style={styles.timeField}>
              <TextInput
                style={styles.timeInput}
                value={form.seconds}
                onChangeText={(val) => handleTimeInput("seconds", val)}
                onBlur={() => formatOnBlur("seconds")}
                keyboardType="number-pad"
                maxLength={2}
                selectTextOnFocus
              />
              <Text style={styles.timeUnit}>s</Text>
            </View>
          </View>
          {errors.duration ? (
            <Text style={styles.errorText}>{errors.duration}</Text>
          ) : null}

          {/* Icon Picker */}
          <Text style={styles.label}>Icon</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.iconScroll}
          >
            {ICON_OPTIONS.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={[
                  styles.iconOption,
                  form.icon === icon && styles.iconOptionActive,
                ]}
                onPress={() => setForm((prev) => ({ ...prev, icon }))}
              >
                <Ionicons
                  name={icon}
                  size={22}
                  color={form.icon === icon ? "#fff" : "#888"}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveText}>Save Preset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  inputError: {
    borderColor: "#ff4d4d",
  },
  errorText: {
    color: "#ff4d4d",
    fontSize: 12,
    marginTop: -4,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  sheet: {
    backgroundColor: "#0f1725",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    gap: 12,
    borderWidth: 1,
    borderColor: "#131d2b",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#2a2a2a",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 8,
  },
  title: { fontSize: 18, fontWeight: "800", color: "#fff", marginBottom: 4 },
  label: { fontSize: 12, color: "#888", letterSpacing: 1 },
  input: {
    backgroundColor: "#050b16",
    borderWidth: 1,
    borderColor: "#131d2b",
    borderRadius: 10,
    padding: 12,
    color: "#fff",
    fontSize: 15,
  },

  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#050b16",
    borderWidth: 1,
    borderColor: "#131d2b",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
    flex: 1,
  },
  timeInput: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    flex: 1,
    textAlign: "center",
  },
  timeUnit: { color: "#888", fontSize: 13 },
  timeSep: { color: "#888", fontSize: 24, fontWeight: "800" },

  iconScroll: { marginVertical: 4 },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#050b16",
    borderWidth: 1,
    borderColor: "#131d2b",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  iconOptionActive: {
    backgroundColor: colors.accentBg,
    borderColor: colors.accent,
  },
  actions: { flexDirection: "row", gap: 10, marginTop: 8 },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  cancelText: { color: "#888", fontWeight: "600" },
  saveBtn: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  saveText: { color: colors.bg, fontWeight: "700" },
});
