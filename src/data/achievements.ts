export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
}

export const achievements: Achievement[] = [
  {
    id: "first-test",
    title: "First Steps",
    description: "Complete your first typing test",
    icon: "🎯",
    requirement: 1,
  },
  {
    id: "speed-30",
    title: "Speed Starter",
    description: "Reach 30 WPM",
    icon: "⚡",
    requirement: 30,
  },
  {
    id: "speed-50",
    title: "Speed Master",
    description: "Reach 50 WPM",
    icon: "🚀",
    requirement: 50,
  },
  {
    id: "speed-80",
    title: "Typing Pro",
    description: "Reach 80 WPM",
    icon: "🏆",
    requirement: 80,
  },
  {
    id: "accuracy-95",
    title: "Precision Master",
    description: "Achieve 95% accuracy",
    icon: "🎖️",
    requirement: 95,
  },
  {
    id: "sessions-10",
    title: "Dedicated Learner",
    description: "Complete 10 typing sessions",
    icon: "🔥",
    requirement: 10,
  },
  {
    id: "sessions-50",
    title: "Typing Champion",
    description: "Complete 50 typing sessions",
    icon: "👑",
    requirement: 50,
  },
];
