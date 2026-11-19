import { useMemo } from "react";
import { Trophy, TrendingUp, Zap } from "lucide-react";

interface Props {
  sessions: {
    wpm: number;
    date: string;
  }[];
}

export default function PersonalBest({ sessions }: Props) {
  const bestSession = useMemo(() => {
    if (sessions.length === 0) return null;

    return sessions.reduce((best, current) =>
      current.wpm > best.wpm ? current : best,
    );
  }, [sessions]);

  return (
    <div className="rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-[#241f12] to-[#151515] p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-yellow-400 font-medium">PERSONAL BEST</p>
          <h3 className="text-lg font-semibold text-white mt-1">
            Your Speed Record
          </h3>
        </div>

        <div className="h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
          <Trophy className="text-yellow-400" size={26} />
        </div>
      </div>

      <div className="mt-6 flex items-end gap-3">
        <span className="text-5xl font-bold text-white">
          {bestSession?.wpm ?? 0}
        </span>
        <span className="text-gray-400 mb-2">WPM</span>
      </div>

      {bestSession ? (
        <div className="flex items-center gap-2 mt-4 text-sm text-green-400">
          <TrendingUp size={17} />
          <span>
            Record achieved on {new Date(bestSession.date).toLocaleDateString()}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
          <Zap size={17} />
          <span>Complete your first typing test to set a record.</span>
        </div>
      )}
    </div>
  );
}
