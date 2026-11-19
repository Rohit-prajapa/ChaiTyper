import { useMemo } from "react";
import { Trophy, Lock, CheckCircle2, Zap, Star } from "lucide-react";

import { achievements } from "../data/achievements";
import { calculateXP, getUserLevel, levels } from "../data/levels";

interface Props {
  sessions: {
    wpm: number;
    accuracy: number;
  }[];
}

export default function Achievements({ sessions }: Props) {
  const totalSessions = sessions.length;

  const bestWpm = Math.max(0, ...sessions.map((s) => s.wpm));
  const bestAccuracy = Math.max(0, ...sessions.map((s) => s.accuracy));

  const xp = useMemo(() => calculateXP(sessions), [sessions]);

  const currentLevel = getUserLevel(xp);

  const nextLevel = levels.find(
    (level) => level.level === currentLevel.level + 1,
  );

  const currentLevelXP = currentLevel.requiredXP;
  const nextLevelXP = nextLevel?.requiredXP ?? currentLevelXP;

  const progress = nextLevel
    ? Math.min(
        100,
        ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100,
      )
    : 100;

  const isUnlocked = (id: string) => {
    switch (id) {
      case "first-test":
        return totalSessions >= 1;
      case "speed-30":
        return bestWpm >= 30;
      case "speed-50":
        return bestWpm >= 50;
      case "speed-80":
        return bestWpm >= 80;
      case "accuracy-95":
        return bestAccuracy >= 95;
      case "sessions-10":
        return totalSessions >= 10;
      case "sessions-50":
        return totalSessions >= 50;
      default:
        return false;
    }
  };

  const unlockedCount = achievements.filter((a) => isUnlocked(a.id)).length;

  return (
    <div className="space-y-8">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold text-white">Achievements</h1>
        <p className="text-gray-400 mt-1">
          Track your typing journey and unlock rewards.
        </p>
      </div>

      {/* Level Card */}
      <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-[#24170f] to-[#151515] p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <p className="text-sm text-orange-400 font-medium">
              YOUR CURRENT LEVEL
            </p>

            <h2 className="text-3xl font-bold text-white mt-2">
              Level {currentLevel.level}
            </h2>

            <p className="text-orange-300 mt-1">{currentLevel.title}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-xl bg-orange-500/15 flex items-center justify-center">
              <Zap className="text-orange-400" size={30} />
            </div>

            <div>
              <p className="text-2xl font-bold text-white">
                {xp.toLocaleString()} XP
              </p>
              <p className="text-sm text-gray-400">Total experience</p>
            </div>
          </div>
        </div>

        <div className="mt-7">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-300">Level progress</span>

            <span className="text-orange-400">
              {nextLevel
                ? `${xp.toLocaleString()} / ${nextLevelXP.toLocaleString()} XP`
                : "Maximum level reached"}
            </span>
          </div>

          <div className="h-3 rounded-full bg-[#35302c] overflow-hidden">
            <div
              className="h-full rounded-full bg-orange-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs text-gray-400 mt-2">
            {nextLevel
              ? `${Math.max(0, nextLevelXP - xp)} XP needed for Level ${nextLevel.level} (${nextLevel.title})`
              : "You have reached the highest available level!"}
          </p>
        </div>
      </div>

      {/* Achievement Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#292929] bg-[#151515] p-5">
          <Trophy className="text-orange-400 mb-3" size={24} />
          <p className="text-2xl font-bold text-white">
            {unlockedCount}/{achievements.length}
          </p>
          <p className="text-sm text-gray-400">Unlocked achievements</p>
        </div>

        <div className="rounded-xl border border-[#292929] bg-[#151515] p-5">
          <Star className="text-yellow-400 mb-3" size={24} />
          <p className="text-2xl font-bold text-white">{bestWpm}</p>
          <p className="text-sm text-gray-400">Personal best WPM</p>
        </div>

        <div className="rounded-xl border border-[#292929] bg-[#151515] p-5">
          <Zap className="text-green-400 mb-3" size={24} />
          <p className="text-2xl font-bold text-white">{totalSessions}</p>
          <p className="text-sm text-gray-400">Total typing sessions</p>
        </div>
      </div>

      {/* Achievement Cards */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-white">Your Rewards</h2>

          <span className="text-sm text-gray-400">
            {unlockedCount} unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => {
            const unlocked = isUnlocked(achievement.id);

            return (
              <div
                key={achievement.id}
                className={`rounded-xl border p-5 transition ${
                  unlocked
                    ? "border-orange-500/30 bg-orange-500/5"
                    : "border-[#292929] bg-[#151515] opacity-70"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{achievement.icon}</span>

                  {unlocked ? (
                    <CheckCircle2 className="text-green-400" size={21} />
                  ) : (
                    <Lock className="text-gray-500" size={20} />
                  )}
                </div>

                <h3 className="text-white font-semibold mt-4">
                  {achievement.title}
                </h3>

                <p className="text-sm text-gray-400 mt-1">
                  {achievement.description}
                </p>

                <p
                  className={`text-xs mt-4 font-medium ${
                    unlocked ? "text-green-400" : "text-gray-500"
                  }`}
                >
                  {unlocked ? "Achievement unlocked" : "Not unlocked yet"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
