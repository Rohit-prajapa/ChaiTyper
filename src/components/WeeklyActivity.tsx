import { useMemo } from "react";
import { Activity } from "lucide-react";

interface Props {
  sessions: {
    date: string;
  }[];
}

export default function WeeklyActivity({ sessions }: Props) {
  const weeklyData = useMemo(() => {
    const today = new Date();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));

      const count = sessions.filter((session) => {
        const sessionDate = new Date(session.date);

        return (
          sessionDate.getFullYear() === date.getFullYear() &&
          sessionDate.getMonth() === date.getMonth() &&
          sessionDate.getDate() === date.getDate()
        );
      }).length;

      return {
        day: days[date.getDay()],
        count,
        isToday: date.toDateString() === today.toDateString(),
      };
    });
  }, [sessions]);

  const maxCount = Math.max(1, ...weeklyData.map((day) => day.count));

  const total = weeklyData.reduce((sum, day) => sum + day.count, 0);

  return (
    <div className="rounded-2xl border border-[#292929] bg-[#151515] p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Weekly Activity</h3>
          <p className="text-sm text-gray-400 mt-1">
            Your last 7 days of practice
          </p>
        </div>

        <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
          <Activity className="text-orange-400" size={22} />
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between gap-3 h-36">
        {weeklyData.map((day, index) => (
          <div
            key={`${day.day}-${index}`}
            className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
          >
            <span className="text-xs text-gray-400">{day.count}</span>

            <div className="w-full flex-1 flex items-end">
              <div
                className={`w-full rounded-t-md transition-all ${
                  day.isToday ? "bg-orange-400" : "bg-orange-500/50"
                }`}
                style={{
                  height: `${Math.max(
                    day.count > 0 ? 8 : 3,
                    (day.count / maxCount) * 100,
                  )}%`,
                }}
              />
            </div>

            <span
              className={`text-xs ${
                day.isToday ? "text-orange-400 font-semibold" : "text-gray-500"
              }`}
            >
              {day.day}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-[#292929] pt-4 flex justify-between">
        <span className="text-sm text-gray-400">Sessions this week</span>

        <span className="text-sm font-semibold text-white">{total}</span>
      </div>
    </div>
  );
}
