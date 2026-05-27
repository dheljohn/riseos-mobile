import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addSleepLog,
  AddSleepPayload,
  deleteSleepLog,
  getSleepLog,
} from "../sleep";
import { SleepLog } from "../../types/logs";
import { Alert } from "react-native";

export const useSleepLog = () => {
  return useQuery({
    queryKey: ["sleep"], // ← match the key you invalidate in addMutation
    queryFn: getSleepLog,
  });
};

export const useAddSleepLog = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddSleepPayload) => addSleepLog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sleep"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      onSuccess?.();
    },
    onError: () => Alert.alert("Error", "Failed to save sleep log"),
  });
};

export const useDeleteSleepLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSleepLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sleep"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => Alert.alert("Error", "Failed to delete sleep log"),
  });
};
