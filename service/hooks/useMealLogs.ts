import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addMealLog,
  AddMealPayload,
  deleteMealLog,
  getMealLogs,
} from "../meals";
import { MealLog } from "../../types/logs";
import { Alert } from "react-native";

export const useMealLogs = () => {
  return useQuery<MealLog[]>({
    queryKey: ["meals"],
    queryFn: getMealLogs,

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};

export const useAddMealLog = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddMealPayload) => addMealLog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      onSuccess?.(); // ← reset form state from component
    },
    onError: () => Alert.alert("Error", "Failed to save meal"),
  });
};

export const useDeleteMealLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMealLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => Alert.alert("Error", "Failed to delete meal"),
  });
};
