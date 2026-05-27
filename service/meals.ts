import api from "../lib/api";

import { MealLog } from "../types/logs";

export interface AddMealPayload {
  mealType: string;
  name: string;
  calories: number | null;
  logDay: string;
}

export const getMealLogs = async (): Promise<MealLog[]> => {
  const res = await api.get("/api/meals");
  console.log("Meals:", res.data);
  return res.data;
};

export const addMealLog = async (data: AddMealPayload): Promise<MealLog> => {
  const res = await api.post("/api/meals", data);
  return res.data;
};

export const deleteMealLog = async (id: string): Promise<void> => {
  await api.delete(`/api/meals/${id}`);
};
