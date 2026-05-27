import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";
import DatePickerField from "../../components/DatePicker";
import {
  useAddMealLog,
  useDeleteMealLog,
  useMealLogs,
} from "../../service/hooks/useMealLogs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"];

export default function MealsScreen() {
  const insets = useSafeAreaInsets();

  const [logDay, setLogDay] = useState(new Date().toLocaleDateString("en-CA"));
  const [mealType, setMealType] = useState("breakfast");
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");

  const { data: logs, isLoading } = useMealLogs();

  const addMutation = useAddMealLog(() => {
    // reset form here — component owns its own state
    setMealType("breakfast");
    setName("");
    setCalories("");
    setLogDay(new Date().toLocaleDateString("en-CA"));
  });

  const deleteMutation = useDeleteMealLog();

  function confirmDelete(id: string) {
    Alert.alert("Delete", "Remove this meal log?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteMutation.mutate(id),
      },
    ]);
  }

  function handleSubmit() {
    if (!name.trim()) {
      Alert.alert("Missing info", "What did you eat?");
      return;
    }
    addMutation.mutate({
      mealType,
      name,
      calories: calories ? Number(calories) : null,
      logDay,
    });
  }

  const totalCalories =
    logs?.reduce((sum, meal) => sum + (meal.calories ?? 0), 0) ?? 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        padding: 20,
        paddingTop: insets.top + 20, // ← respects status bar
        paddingBottom: insets.bottom + 90, // ← respects home indicator + nav bar
      }}
      // contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Meals</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.formTitle}>Log a Meal</Text>

        {/* Date Picker */}
        <DatePickerField label="Date" value={logDay} onChange={setLogDay} />

        {/* Meal Type */}
        <Text style={styles.label}>Meal Type</Text>
        <View style={styles.typeRow}>
          {MEAL_TYPES.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.typeBtn, mealType === t && styles.typeBtnActive]}
              onPress={() => setMealType(t)}
            >
              <Text
                style={[
                  styles.typeBtnText,
                  mealType === t && styles.typeBtnTextActive,
                ]}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Meal Name */}
        <TextInput
          style={styles.input}
          placeholder="What did you eat?"
          placeholderTextColor="#555"
          value={name}
          onChangeText={setName}
        />

        {/* Calories */}
        <TextInput
          style={styles.input}
          placeholder="Calories (optional)"
          placeholderTextColor="#555"
          keyboardType="numeric"
          value={calories}
          onChangeText={setCalories}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={addMutation.isPending}
        >
          {addMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Add Meal</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Logs */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionHeader}>All Logs</Text>
        <Text style={styles.totalCalories}>{totalCalories} kcal</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator color="#6c63ff" />
      ) : logs?.length === 0 ? (
        <Text style={styles.empty}>No meals logged yet</Text>
      ) : (
        logs?.map((log) => (
          <View key={log.id} style={styles.logCard}>
            <View style={styles.logRow}>
              <View style={{ flex: 1 }}>
                <View style={styles.logTitleRow}>
                  <Text style={styles.logType}>
                    {log.mealType.charAt(0).toUpperCase() +
                      log.mealType.slice(1)}
                  </Text>
                  <Text style={styles.logDot}>•</Text>
                  <Text style={styles.logName}>{log.name}</Text>
                </View>
                <View style={styles.logMeta}>
                  {log.calories ? (
                    <Text style={styles.logMetaText}>{log.calories} kcal</Text>
                  ) : null}
                  <Text style={styles.logMetaText}>
                    {new Date(log.logDay + "T00:00:00").toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => confirmDelete(log.id)}
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
  form: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    gap: 12,
    marginBottom: 24,
  },
  formTitle: { fontSize: 16, fontWeight: "700", color: "#fff" },
  label: { fontSize: 12, color: "#888" },
  typeRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  typeBtn: {
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 11,
  },
  typeBtnActive: { backgroundColor: "#6c63ff", borderColor: "#6c63ff" },
  typeBtnText: { color: "#888", fontSize: 13 },
  typeBtnTextActive: { color: "#fff", fontWeight: "700" },
  input: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#6c63ff",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700" },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionHeader: { fontSize: 16, fontWeight: "700", color: "#fff" },
  totalCalories: { fontSize: 13, color: "#888" },
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
  logTitleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  logType: { fontSize: 12, color: "#6c63ff", fontWeight: "700" },
  logDot: { fontSize: 12, color: "#555" },
  logName: { fontSize: 14, fontWeight: "600", color: "#fff" },
  logMeta: { flexDirection: "row", gap: 10, marginTop: 4 },
  logMetaText: { fontSize: 11, color: "#888" },
  deleteBtn: { padding: 8 },
  deleteText: { color: "#ff4d4d", fontSize: 16 },
});
