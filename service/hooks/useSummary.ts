import { useQuery } from "@tanstack/react-query";
import { getSummary } from "../summary";
import { Summary } from "../../types/summary";

export const useSummary = () => {
  return useQuery<Summary>({
    queryKey: ["summary"],
    queryFn: getSummary,
  });
};
