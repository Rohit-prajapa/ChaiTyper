import { useEffect, useState } from "react";
import { Target, Flame, CheckCircle2 } from "lucide-react";

interface Props {
  sessions: {
    date: string;
  }[];
  dailyTarget?: number;
}

const STORAGE_KEY = "chaityper-daily-target";

export default function DailyGoal({ sessions, dailyTarget = 3 }: Props) {
  const [target, setTarget] = useState(() => {
    try {
      const saved = Number(localStorage.getItem(STORAGE_KEY));
      return [3, 5, 10, 15].includes(saved) ? saved : dailyTarget;
    } catch {
      return dailyTarget;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(target));
    } catch {
      // Ignore storage errors
    }
  }, [target]);

  const today = new Date().toDateString();

  const completedToday = sessions.filter(
    (session) => new Date(session.date).toDateString() === today,
  ).length;

  const progress = Math.min(100, (completedToday / target) * 100);
  const goalCompleted = completedToday >= target;

  return (
    <div className="rounded-2xl border border-[#292929] bg-[#151515] p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <Target className="text-orange-400" size={23} />
          </div>

          <div>
            <h3 className="font-semibold text-white">Daily Typing Goal</h3>
            <p className="text-sm text-gray-400">
              Set your daily practice target
            </p>
          </div>
        </div>

        {goalCompleted && <CheckCircle2 className="text-green-400" size={25} />}
      </div>

      <div className="mt-5">
        <p className="text-xs text-gray-400 mb-3">Choose your target</p>

        <div className="flex gap-2 flex-wrap">
          {[3, 5, 10, 15].map((value) => (
            <button
              key={value}
              onClick={() => setTarget(value)}
              className={`px-4 py-2 rounded-lg text-sm transition ${
                target === value
                  ? "bg-orange-500 text-white"
                  : "bg-[#252525] text-gray-400 hover:text-white"
              }`}
            >
              {value} sessions
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between">
        <p className="text-2xl font-bold text-white">
          {completedToday}
          <span className="text-gray-500 text-base"> / {target}</span>
        </p>

        <div className="flex items-center gap-1 text-sm text-orange-400">
          <Flame size={17} />
          {goalCompleted ? "Goal completed!" : "Keep going!"}
        </div>
      </div>

      <div className="mt-3 h-3 rounded-full bg-[#292929] overflow-hidden">
        <div
          className="h-full rounded-full bg-orange-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-xs text-gray-500 mt-3">
        {goalCompleted
          ? "Excellent! You achieved today's typing goal."
          : `${target - completedToday} more sessions to reach today's goal.`}
      </p>
    </div>
  );
}
