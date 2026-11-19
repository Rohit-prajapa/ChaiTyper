import { Gauge, Keyboard, Target, AlertCircle } from "lucide-react";

interface StatsCardProps {
  wpm: number;
  cpm: number;
  accuracy: number;
  errors: number;
}

const StatsCard = ({ wpm, cpm, accuracy, errors }: StatsCardProps) => {
  const accuracyColor =
    accuracy >= 95
      ? "text-green-500"
      : accuracy >= 80
        ? "text-orange-500"
        : "text-red-500";

  const stats = [
    {
      label: "WPM",
      description: "Words per minute",
      value: wpm,
      icon: Gauge,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      label: "CPM",
      description: "Characters per minute",
      value: cpm,
      icon: Keyboard,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Accuracy",
      description: "Typing accuracy",
      value: `${accuracy}%`,
      icon: Target,
      color: accuracyColor,
      bg:
        accuracy >= 95
          ? "bg-green-500/10"
          : accuracy >= 80
            ? "bg-orange-500/10"
            : "bg-red-500/10",
    },
    {
      label: "Errors",
      description: "Incorrect characters",
      value: errors,
      icon: AlertCircle,
      color: errors > 0 ? "text-red-500" : "text-green-500",
      bg: errors > 0 ? "bg-red-500/10" : "bg-green-500/10",
    },
  ];

  return (
    <section
      className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      aria-label="Typing statistics"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="group min-w-0 rounded-xl border border-[#292929] bg-[#171717] p-4 sm:p-5 transition-all duration-200 hover:border-orange-500/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </p>

                <p className="text-[10px] sm:text-xs text-gray-500 mt-1 truncate">
                  {stat.description}
                </p>
              </div>

              <div
                className={`shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${stat.bg}`}
              >
                <Icon size={19} className={stat.color} />
              </div>
            </div>

            <p
              className={`mt-4 text-2xl sm:text-3xl font-bold tabular-nums tracking-tight ${stat.color}`}
              aria-label={`${stat.label}: ${stat.value}`}
            >
              {stat.value}
            </p>
          </div>
        );
      })}
    </section>
  );
};

export default StatsCard;
