export interface UserLevel {
  level: number;
  title: string;
  requiredXP: number;
}

export const levels: UserLevel[] = [
  { level: 1, title: "Beginner", requiredXP: 0 },
  { level: 2, title: "Learner", requiredXP: 100 },
  { level: 3, title: "Typist", requiredXP: 300 },
  { level: 4, title: "Skilled Typist", requiredXP: 600 },
  { level: 5, title: "Pro Typist", requiredXP: 1000 },
  { level: 6, title: "Typing Expert", requiredXP: 1600 },
  { level: 7, title: "Master Typist", requiredXP: 2500 },
  { level: 8, title: "Typing Legend", requiredXP: 4000 },
];

export const calculateXP = (sessions: { wpm: number; accuracy: number }[]) =>
  sessions.reduce((total, session) => {
    return total + Math.max(0, Math.round(session.wpm + session.accuracy / 10));
  }, 0);

export const getUserLevel = (xp: number) => {
  return (
    [...levels].reverse().find((level) => xp >= level.requiredXP) ?? levels[0]
  );
};
