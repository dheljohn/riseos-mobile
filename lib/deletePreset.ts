import AsyncStorage from "@react-native-async-storage/async-storage";

const DELETED_PRESETS_KEY = "deleted_default_presets";

export async function getDeletedPresetIds(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(DELETED_PRESETS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function markPresetDeleted(id: string): Promise<void> {
  const existing = await getDeletedPresetIds();
  if (!existing.includes(id)) {
    await AsyncStorage.setItem(
      DELETED_PRESETS_KEY,
      JSON.stringify([...existing, id]),
    );
  }
}
