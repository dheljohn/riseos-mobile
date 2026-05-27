export interface FocusSession {
  id: string;
  label: string;
  durationMins: number;
  completed: boolean;
  logDay: string;
  createdAt: string;
}
export interface SleepLog {
  id: string;
  durationHrs: number;
  energyLevel: number;
  logDay: string;
  createdAt: string;
}

export interface MealLog {
  id: string;
  mealType: string;
  name: string;
  calories: number | null;
  logDay: string;
  createdAt: string;
}
