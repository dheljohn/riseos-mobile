import api from "../lib/api";
import { Summary } from "../types/summary";

export const getSummary = async (): Promise<Summary> => {
  const res = await api.get("/api/summary");

  return res.data;
};
