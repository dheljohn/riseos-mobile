import { isToday, isYesterday } from "date-fns";

export function formatLogDate(dateInput: string | Date) {
  const date = new Date(dateInput);

  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
