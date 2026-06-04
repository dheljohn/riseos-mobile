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
import DatePickerField from "../../components/DatePicker";
import {
  useAddMealLog,
  useDeleteMealLog,
  useMealLogs,
} from "../../service/hooks/useMealLogs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../styles/theme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Ionicons } from "@expo/vector-icons";
import { formatLogDate } from "../../utils/dateFormatter";

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"];

export default function MealsScreen() {
  const insets = useSafeAreaInsets();
  const today = new Date();

  const [logDay, setLogDay] = useState(new Date().toLocaleDateString("en-CA"));
  const [mealType, setMealType] = useState("breakfast");
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");

  const { data: logs, isLoading } = useMealLogs();

  const addMutation = useAddMealLog(() => {
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
    logs
      ?.filter((meal) => {
        const mealDate = new Date(meal.logDay);
        return mealDate.toDateString() === today.toDateString();
      })
      .reduce((sum, meal) => sum + (meal.calories ?? 0), 0) ?? 0;

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
        <Text style={styles.sectionHeader}>Previous Logs</Text>
        <Text style={styles.totalCalories}>Today: {totalCalories} kcal</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator color={colors.accent} />
      ) : logs?.length === 0 ? (
        <Text style={styles.empty}>No meals logged yet</Text>
      ) : (
        logs?.map((log) => (
          <View key={log.id} style={styles.logCard}>
            <View style={styles.logIcon}>
              <FontAwesome name="cutlery" size={18} color="#00f0f2" />
            </View>
            <View style={styles.logRow}>
              <View style={{ flex: 1 }}>
                <View style={styles.logTitle}>
                  <Text style={styles.logName}>{log.name}</Text>
                </View>

                <View style={styles.logMeta}>
                  <Text style={styles.logType}>
                    {log.mealType.charAt(0).toUpperCase() +
                      log.mealType.slice(1)}
                  </Text>
                  {log.calories ? (
                    <>
                      <Text style={styles.logDot}>•</Text>
                      <Text style={styles.logMetaText}>
                        {log.calories} kcal
                      </Text>
                    </>
                  ) : null}
                  {/* <View style={styles.logMetaRow}>
                    {log.calories ? (
                      <>
                        <Text style={styles.logDot}>•</Text>
                        <Text style={styles.logMetaText}>
                          {log.calories} kcal
                        </Text>
                      </>
                    ) : null}
                  </View> */}
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
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  logTitle: { flexDirection: "row", alignItems: "center", gap: 4 },
  logMetaRow: { flexDirection: "row", alignItems: "center", gap: 8 },
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
    gap: 12,
    marginBottom: 24,
  },
  formTitle: { fontSize: 16, fontWeight: "700", color: "#fff" },
  label: { fontSize: 12, color: "#888" },
  typeRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  typeBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgIconContainer,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 11,
  },
  typeBtnActive: {
    backgroundColor: colors.accentBg,
    borderColor: colors.accent,
  },
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
    backgroundColor: colors.accent,
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  buttonText: { color: colors.bg, fontWeight: "700" },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionHeader: { fontSize: 16, fontWeight: "700", color: "#fff" },
  totalCalories: { fontSize: 13, color: "#888" },
  empty: { color: "#555", fontSize: 14, textAlign: "center", marginTop: 20 },
  logRow: { flexDirection: "row", alignItems: "center", flex: 1 },
  logTitleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  logType: { fontSize: 12, color: "#888", fontWeight: "700" },
  logDot: { fontSize: 12, color: "#555" },
  logName: { fontSize: 14, fontWeight: "600", color: "#fff", gap: 8 },
  logDate: { fontSize: 11, color: "#555", marginTop: 0 },

  logMeta: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
    alignItems: "center",
  },
  logMetaText: { fontSize: 11, color: "#888" },
  deleteBtn: { padding: 8 },

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
});
