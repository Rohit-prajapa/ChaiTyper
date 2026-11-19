import { useMemo, useState } from "react";
import {
  Trophy,
  Gauge,
  Target,
  Keyboard,
  Clock,
  ArrowLeft,
  TrendingUp,
  Flame,
} from "lucide-react";

export interface TypingSession {
  id: string;
  language: string;
  lesson: string;
  wpm: number;
  cpm: number;
  accuracy: number;
  errors: number;
  duration: number;
  date: string;
}

interface ProgressProps {
  sessions: TypingSession[];
  onBack: () => void;
}

type Period = "all" | "daily" | "weekly" | "monthly";

const LANGUAGE_LABELS: Record<string, string> = {
  javascript: "JavaScript",
  python: "Python",
  cpp: "C++",
};

const formatDate = (date: string) => {
  const d = new Date(date);

  if (Number.isNaN(d.getTime())) return "-";

  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

const formatDuration = (seconds: number) => {
  const total = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(total / 60);
  const remainingSeconds = total % 60;

  return minutes > 0
    ? `${minutes}m ${remainingSeconds}s`
    : `${remainingSeconds}s`;
};

const accuracyColor = (accuracy: number) =>
  accuracy >= 95
    ? "text-green-400"
    : accuracy >= 80
      ? "text-orange-500"
      : "text-red-500";

// Calculate current and longest typing streak
const calculateStreaks = (sessions: TypingSession[]) => {
  const days = [
    ...new Set(
      sessions
        .filter((s) => !Number.isNaN(new Date(s.date).getTime()))
        .map((s) => {
          const date = new Date(s.date);
          const y = date.getFullYear();
          const m = String(date.getMonth() + 1).padStart(2, "0");
          const d = String(date.getDate()).padStart(2, "0");
          return `${y}-${m}-${d}`;
        }),
    ),
  ].sort();

  if (days.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const dayMs = 24 * 60 * 60 * 1000;

  const dates = days.map((day) => {
    const [year, month, date] = day.split("-").map(Number);
    return Date.UTC(year, month - 1, date);
  });

  let longestStreak = 1;
  let streak = 1;

  for (let i = 1; i < dates.length; i++) {
    streak = dates[i] - dates[i - 1] === dayMs ? streak + 1 : 1;

    longestStreak = Math.max(longestStreak, streak);
  }

  const today = new Date();
  const todayUTC = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const lastDay = dates[dates.length - 1];

  const currentStreak = todayUTC - lastDay <= dayMs ? streak : 0;

  return { currentStreak, longestStreak };
};

const Progress = ({ sessions, onBack }: ProgressProps) => {
  const [period, setPeriod] = useState<Period>("all");

  // Calculate streaks using all sessions
  const { currentStreak, longestStreak } = calculateStreaks(sessions);

  // Filter sessions
  const filteredSessions = useMemo(() => {
    const now = new Date();

    return sessions.filter((session) => {
      const date = new Date(session.date);

      if (Number.isNaN(date.getTime())) return false;

      if (period === "daily") {
        return date.toDateString() === now.toDateString();
      }

      if (period === "weekly") {
        const start = new Date(now);
        start.setDate(now.getDate() - 6);
        start.setHours(0, 0, 0, 0);

        return date >= start && date <= now;
      }

      if (period === "monthly") {
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      }

      return true;
    });
  }, [sessions, period]);

  const count = filteredSessions.length;

  const bestWpm = Math.max(0, ...filteredSessions.map((s) => s.wpm));

  const bestAccuracy = Math.max(0, ...filteredSessions.map((s) => s.accuracy));

  const averageWpm = count
    ? Math.round(filteredSessions.reduce((sum, s) => sum + s.wpm, 0) / count)
    : 0;

  const averageAccuracy = count
    ? Math.round(
        filteredSessions.reduce((sum, s) => sum + s.accuracy, 0) / count,
      )
    : 0;

  const totalTime = filteredSessions.reduce((sum, s) => sum + s.duration, 0);

  const stats = [
    {
      title: "Best WPM",
      value: bestWpm,
      icon: Trophy,
      description: "Personal record",
    },
    {
      title: "Average WPM",
      value: averageWpm,
      icon: Gauge,
      description: "Across selected sessions",
    },
    {
      title: "Average Accuracy",
      value: `${averageAccuracy}%`,
      icon: Target,
      description: "Typing precision",
    },
    {
      title: "Total Sessions",
      value: count,
      icon: Keyboard,
      description: "Recorded tests",
    },
  ];

  const sortedSessions = [...filteredSessions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const recentSessions = sortedSessions.slice(-8).reverse();
  const chartSessions = sortedSessions.slice(-7);

  const maxWpm = Math.max(10, ...chartSessions.map((s) => s.wpm));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-orange-500 mb-3 transition"
          >
            <ArrowLeft size={16} />
            Back to Practice
          </button>

          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Your Progress
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Track your coding typing performance.
          </p>
        </div>

        <div className="flex items-center gap-2 text-orange-500">
          <TrendingUp size={20} />
          <span className="text-sm font-semibold">Performance Overview</span>
        </div>
      </div>

      {/* Period Filters */}
      <div className="flex flex-wrap gap-2">
        {(["all", "daily", "weekly", "monthly"] as const).map((item) => (
          <button
            key={item}
            onClick={() => setPeriod(item)}
            aria-pressed={period === item}
            className={`px-4 py-2 rounded-lg text-sm capitalize transition ${
              period === item
                ? "bg-orange-500 text-white"
                : "bg-[#202020] text-gray-400 hover:text-white"
            }`}
          >
            {item === "all" ? "All Time" : item}
          </button>
        ))}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="bg-[#171717] border border-[#292929] rounded-xl p-5 hover:border-orange-500/40 transition"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">{stat.title}</p>
                <Icon size={20} className="text-orange-500" />
              </div>

              <h2 className="text-3xl font-bold text-orange-500 mt-4 tabular-nums">
                {stat.value}
              </h2>

              <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
            </div>
          );
        })}
      </div>

      {/* Streak Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#171717] border border-[#292929] rounded-xl p-5 hover:border-orange-500/40 transition">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">Current Streak</p>
            <Flame className="text-orange-500" size={22} />
          </div>

          <h2 className="text-3xl font-bold text-orange-500 mt-4">
            {currentStreak} Days 🔥
          </h2>

          <p className="text-xs text-gray-500 mt-2">
            Keep practicing every day!
          </p>
        </div>

        <div className="bg-[#171717] border border-[#292929] rounded-xl p-5 hover:border-orange-500/40 transition">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">Longest Streak</p>
            <Trophy className="text-orange-500" size={22} />
          </div>

          <h2 className="text-3xl font-bold text-orange-500 mt-4">
            {longestStreak} Days 🏆
          </h2>

          <p className="text-xs text-gray-500 mt-2">
            Your personal best streak
          </p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-[#171717] border border-[#292929] rounded-xl p-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white font-semibold">Typing Performance</h2>
            <p className="text-xs text-gray-500 mt-1">
              Last 7 recorded sessions (WPM)
            </p>
          </div>

          <TrendingUp className="text-orange-500" />
        </div>

        {chartSessions.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center">
            <Gauge size={35} className="text-gray-600 mb-3" />
            <p className="text-gray-400 text-sm">No performance data yet.</p>
            <p className="text-gray-600 text-xs mt-1">
              Complete a typing test to see your chart.
            </p>
          </div>
        ) : (
          <div className="h-56 flex items-end gap-3 border-b border-[#333] px-2">
            {chartSessions.map((session) => (
              <div
                key={session.id}
                className="flex-1 h-full flex flex-col justify-end items-center gap-2"
              >
                <span className="text-xs text-orange-500 font-semibold tabular-nums">
                  {session.wpm}
                </span>

                <div
                  title={`${session.wpm} WPM • ${session.accuracy}% accuracy`}
                  className="w-full max-w-12 rounded-t-md bg-orange-500 hover:bg-orange-400 transition-all"
                  style={{
                    height: `${Math.max(4, (session.wpm / maxWpm) * 70)}%`,
                  }}
                />

                <span className="text-[10px] text-gray-500 pb-2">
                  {formatDate(session.date)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#171717] border border-[#292929] rounded-xl p-5">
          <div className="flex items-center gap-3">
            <Clock className="text-orange-500" />

            <div>
              <p className="text-sm text-gray-400">Total Practice Time</p>

              <h2 className="text-2xl font-bold text-white mt-1">
                {formatDuration(totalTime)}
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-[#171717] border border-[#292929] rounded-xl p-5">
          <div className="flex items-center gap-3">
            <Target className="text-orange-500" />

            <div>
              <p className="text-sm text-gray-400">Best Accuracy</p>

              <h2 className="text-2xl font-bold text-white mt-1">
                {bestAccuracy}%
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-[#171717] border border-[#292929] rounded-xl overflow-hidden">
        <div className="p-5 border-b border-[#292929]">
          <h2 className="text-white font-semibold">Recent Sessions</h2>

          <p className="text-xs text-gray-500 mt-1">
            Your latest completed typing tests
          </p>
        </div>

        {recentSessions.length === 0 ? (
          <div className="p-10 text-center text-gray-500 text-sm">
            No sessions recorded yet. Start practicing!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 bg-[#202020] uppercase tracking-wider">
                <tr>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Lesson</th>
                  <th className="p-4 font-medium">Language</th>
                  <th className="p-4 font-medium">WPM</th>
                  <th className="p-4 font-medium">Accuracy</th>
                  <th className="p-4 font-medium">Duration</th>
                </tr>
              </thead>

              <tbody>
                {recentSessions.map((session) => (
                  <tr
                    key={session.id}
                    className="border-t border-[#292929] hover:bg-[#202020] transition-colors"
                  >
                    <td className="p-4 text-gray-400">
                      {formatDate(session.date)}
                    </td>

                    <td className="p-4 text-white">{session.lesson}</td>

                    <td className="p-4 text-gray-400">
                      {LANGUAGE_LABELS[session.language] ?? session.language}
                    </td>

                    <td className="p-4 text-orange-500 font-semibold tabular-nums">
                      {session.wpm}
                    </td>

                    <td
                      className={`p-4 tabular-nums ${accuracyColor(
                        session.accuracy,
                      )}`}
                    >
                      {session.accuracy}%
                    </td>

                    <td className="p-4 text-gray-400 tabular-nums">
                      {formatDuration(session.duration)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
