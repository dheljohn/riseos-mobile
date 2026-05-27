import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteFocusSession, getFocusLogs, saveFocusSession } from "../focus";
import { FocusSession } from "../../types/logs";
import { Alert } from "react-native";

export const useFocusLogs = () => {
  return useQuery<FocusSession[]>({
    queryKey: ["meals"], // ← match the key you invalidate in addMutation
    queryFn: getFocusLogs,
  });
};

export const useSaveFocusSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveFocusSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["focus"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => Alert.alert("Error", "Failed to save session"),
  });
};

export const useDeleteFocusSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFocusSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["focus"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => Alert.alert("Error", "Failed to delete session"),
  });
};
