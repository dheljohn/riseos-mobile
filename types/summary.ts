export interface Summary {
  weekStart: string;
  weekEnd: string;

  user: {
    currentStreak: number;
    longestStreak: number;
    name: string;
  };

  sleep: {
    totalLogs: number;
    todaySleepDur: number;
    todayEnergyLevel: number;
    todayAvgEnergy: number;
    avgSleepHours: number;
    avgEnergyLevel: number;
    logs: any[];
  };

  meals: {
    totalLogs: number;
    todaysMeals: number;
    totalCalories: number;
    todayCalories: number;
    mealsByType: Record<string, number>;
    logs: any[];
  };

  focus: {
    totalSessions: number;
    todaySessions: number;
    completedSessions: number;
    completionRate: number;
    totalFocusMinutes: number;
    avgSessionDurationMins: number;
    longestSessionMins: number;
    sessions: any[];
  };

  patterns: string[];
}
