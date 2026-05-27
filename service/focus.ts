import api from "../lib/api";
import { FocusSession } from "../types/logs";

export const getFocusLogs = async (): Promise<FocusSession[]> => {
  const res = await api.get("/api/focus");
  console.log("FOCUS:", res.data);
  return res.data;
};
export const saveFocusSession = async (data: {
  label: string;
  durationMins: number;
  completed: boolean;
}) => {
  const res = await api.post("/api/focus", {
    ...data,
    logDay: new Date().toLocaleDateString("en-CA"),
  });
  return res.data;
};

export const deleteFocusSession = async (id: string): Promise<void> => {
  await api.delete(`/api/focus/${id}`);
};
