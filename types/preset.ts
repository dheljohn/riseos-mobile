export interface Preset {
  id: string;
  name: string;
  icon: string;
  durationSecs: number;
}

export const DEFAULT_PRESETS: Preset[] = [
  {
    id: "default-1",
    name: "Study",
    icon: "timer-outline",
    durationSecs: 25 * 60,
  },
  // {
  //   id: "default-2",
  //   name: "Deep Work",
  //   icon: "laptop-outline",
  //   durationSecs: 90 * 60,
  // },
  // {
  //   id: "default-3",
  //   name: "Quick Focus",
  //   icon: "flash-outline",
  //   durationSecs: 15 * 60,
  // },
];
