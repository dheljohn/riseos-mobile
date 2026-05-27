import api from "../lib/api";
import { Summary } from "../types/summary";

export const getSummary = async (): Promise<Summary> => {
  const res = await api.get("/api/summary");
  // console.log("USER:", res.data.user);
  // console.log("SLEEP:", res.data.sleep);
  // console.log("FOCUS:", res.data.focus);
  // console.log("MEALS:", res.data.meals);
  // console.log("WEIGHT:", res);

  return res.data;
};
