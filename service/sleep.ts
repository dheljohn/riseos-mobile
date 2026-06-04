import api from "../lib/api";
import { SleepLog } from "../types/logs";

export interface AddSleepPayload {
  durationHrs: number;
  energyLevel: number;
  logDay: string;
}
export const getSleepLog = async (): Promise<SleepLog[]> => {
  const res = await api.get("/api/sleep");
  return res.data;
};

export const addSleepLog = async (data: AddSleepPayload): Promise<SleepLog> => {
  const res = await api.post("/api/sleep", data);
  return res.data;
};

export const deleteSleepLog = async (id: string): Promise<void> => {
  await api.delete(`/api/sleep/${id}`);
};
