import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Circle,
  CheckCircle2,
  PlayCircle,
  Coffee,
  Code2,
  BookOpen,
  Zap,
  Gauge,
  Target,
  Trophy,
  Menu,
  X,
} from "lucide-react";

interface SidebarProps {
  language: string;
  setLanguage: (language: string) => void;
  activeLesson: string;
  setActiveLesson: (lesson: string) => void;
  lessons: string[];
  completedLessons?: string[];
  stats?: {
    wpm: number;
    accuracy: number;
  };
  practice?: boolean;
  setPractice?: (value: boolean) => void;
  onAchievements?: () => void;
}

const languages = [
  { id: "javascript", label: "JS" },
  { id: "python", label: "PY" },
  { id: "cpp", label: "C++" },
];

const Sidebar = ({
  language,
  setLanguage,
  activeLesson,
  setActiveLesson,
  lessons,
  completedLessons = [],
  stats,
  practice: practiceProp,
  setPractice: setPracticeProp,
  onAchievements,
}: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [practiceLocal, setPracticeLocal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const practice = practiceProp ?? practiceLocal;
  const setPractice = setPracticeProp ?? setPracticeLocal;

  const completedCount = lessons.filter((lesson) =>
    completedLessons.includes(lesson),
  ).length;

  const progressPct = lessons.length
    ? Math.round((completedCount / lessons.length) * 100)
    : 0;

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const selectLesson = (lesson: string) => {
    setActiveLesson(lesson);
    setMobileOpen(false);
  };

  const renderLanguageButtons = (compact = false) =>
    languages.map((item) => {
      const selected = language === item.id;

      const sizeClass = compact
        ? "w-11 h-8 rounded-md text-[11px]"
        : "h-9 rounded-lg text-sm";

      const colorClass = selected
        ? "bg-orange-500 text-white"
        : compact
          ? "bg-[#1a1a1a] text-gray-400 hover:text-white"
          : "bg-[#1a1a1a] text-gray-400 border border-[#292929] hover:border-orange-500/50 hover:text-white";

      return (
        <button
          key={item.id}
          type="button"
          onClick={() => {
            setLanguage(item.id);
            setMobileOpen(false);
          }}
          title={item.label}
          aria-pressed={selected}
          className={`font-bold transition ${sizeClass} ${colorClass}`}
        >
          {item.label}
        </button>
      );
    });

  const sidebarContent = (
    <>
      {/* Brand Header */}
      <div className="px-5 pt-5 pb-5 border-b border-[#222]">
        <div className="flex items-center gap-2">
          <Coffee className="text-orange-500 shrink-0" size={25} />

          {!collapsed && (
            <div>
              <h1 className="text-[22px] font-bold tracking-tight text-orange-500">
                ChaiTyper
              </h1>
              <p className="text-xs text-gray-500 mt-1">Learn by typing</p>
            </div>
          )}
        </div>
      </div>

      {!collapsed ? (
        <>
          {/* Language Selector */}
          <div className="px-5 pt-5">
            <div className="flex items-center gap-2 mb-3">
              <Code2 size={14} className="text-gray-500" />
              <p className="text-[11px] font-semibold tracking-[1.5px] text-gray-500 uppercase">
                Language
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {renderLanguageButtons()}
            </div>
          </div>

          {/* Practice Toggle */}
          <div className="mx-5 mt-5 px-3 py-3 flex items-center justify-between bg-[#171717] border border-[#292929] rounded-lg">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-orange-500" />
              <span className="text-sm font-medium text-gray-300">
                Practice
              </span>
            </div>

            <button
              type="button"
              onClick={() => setPractice(!practice)}
              aria-label="Toggle practice mode"
              aria-pressed={practice}
              className={`relative w-10 h-[22px] rounded-full transition-colors ${
                practice ? "bg-orange-500" : "bg-[#383838]"
              }`}
            >
              <span
                className={`absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white transition-transform ${
                  practice ? "translate-x-[18px]" : ""
                }`}
              />
            </button>
          </div>

          {/* Lessons Header */}
          <div className="px-5 pt-6 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen size={15} className="text-gray-500" />
                <p className="text-[11px] font-semibold tracking-[1.5px] text-gray-500 uppercase">
                  Lessons
                </p>
              </div>

              <span className="text-[10px] text-gray-500">
                {completedCount}/{lessons.length}
              </span>
            </div>

            <div
              role="progressbar"
              aria-label="Lessons completed"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressPct}
              className="mt-3 h-1 w-full rounded-full bg-[#222] overflow-hidden"
            >
              <div
                className="h-full bg-orange-500 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Lesson List */}
          <nav className="flex-1 min-h-0 overflow-y-auto px-3 pb-4 space-y-1">
            {lessons.map((lesson, index) => {
              const active = activeLesson === lesson;
              const done = completedLessons.includes(lesson);

              return (
                <button
                  key={lesson}
                  type="button"
                  onClick={() => selectLesson(lesson)}
                  title={lesson}
                  aria-current={active ? "true" : undefined}
                  className={`group w-full min-h-[38px] flex items-center gap-3 px-3 rounded-lg text-left text-[13px] font-medium transition ${
                    active
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/10"
                      : "text-gray-400 hover:bg-[#191919] hover:text-white"
                  }`}
                >
                  {active ? (
                    <PlayCircle size={16} className="shrink-0" />
                  ) : done ? (
                    <CheckCircle2
                      size={16}
                      className="shrink-0 text-green-500"
                    />
                  ) : (
                    <Circle
                      size={15}
                      className="shrink-0 text-gray-600 group-hover:text-orange-400"
                    />
                  )}

                  <span className="truncate">{lesson}</span>

                  <span
                    className={`ml-auto text-[10px] tabular-nums ${
                      active ? "text-orange-100" : "text-gray-600"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Achievements */}
          <div className="px-3 pb-3 border-t border-[#222] pt-3">
            <button
              type="button"
              onClick={() => {
                onAchievements?.();
                setMobileOpen(false);
              }}
              disabled={!onAchievements}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-400 hover:bg-[#191919] hover:text-orange-500 transition disabled:opacity-50"
            >
              <Trophy size={18} className="shrink-0 text-orange-500" />
              <span>Achievements</span>
            </button>
          </div>

          {/* Live Statistics */}
          {stats && (
            <div className="mx-5 mb-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-[#171717] border border-[#292929] px-3 py-2">
                <div className="flex items-center gap-1.5 text-[10px] text-gray-500 uppercase tracking-wider">
                  <Gauge size={12} /> WPM
                </div>
                <p className="mt-1 text-lg font-bold text-orange-500 leading-none">
                  {stats.wpm}
                </p>
              </div>

              <div className="rounded-lg bg-[#171717] border border-[#292929] px-3 py-2">
                <div className="flex items-center gap-1.5 text-[10px] text-gray-500 uppercase tracking-wider">
                  <Target size={12} /> Acc
                </div>
                <p className="mt-1 text-lg font-bold text-orange-500 leading-none">
                  {stats.accuracy}%
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-5 py-3 border-t border-[#222]">
            <p className="text-[10px] text-gray-600 text-center">
              ChaiTyper • Coding Practice
            </p>
          </div>
        </>
      ) : (
        /* Collapsed Desktop Sidebar */
        <div className="flex-1 min-h-0 flex flex-col items-center gap-4 pt-5 pb-4">
          <div className="flex flex-col gap-2">
            {renderLanguageButtons(true)}
          </div>

          <div className="w-8 border-t border-[#222]" />

          <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-1.5">
            {lessons.map((lesson, index) => {
              const active = activeLesson === lesson;
              const done = completedLessons.includes(lesson);

              return (
                <button
                  key={lesson}
                  type="button"
                  onClick={() => selectLesson(lesson)}
                  title={lesson}
                  aria-label={lesson}
                  aria-current={active ? "true" : undefined}
                  className={`w-9 h-9 rounded-lg text-xs font-semibold tabular-nums transition ${
                    active
                      ? "bg-orange-500 text-white"
                      : done
                        ? "bg-[#1a1a1a] text-green-500 hover:bg-[#222]"
                        : "bg-[#1a1a1a] text-gray-500 hover:text-white hover:bg-[#222]"
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          <div className="border-t border-[#222] pt-3 w-full flex justify-center">
            <button
              type="button"
              onClick={onAchievements}
              disabled={!onAchievements}
              title="Achievements"
              aria-label="Achievements"
              className="p-3 text-orange-500 hover:bg-[#191919] rounded-lg transition disabled:opacity-50"
            >
              <Trophy size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={mobileOpen}
        className="md:hidden fixed top-4 left-4 z-[60] w-10 h-10 rounded-lg bg-[#171717] border border-[#333] text-white flex items-center justify-center shadow-lg"
      >
        <Menu size={21} />
      </button>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 z-[70] bg-black/65 backdrop-blur-[2px]"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-[80]
          flex flex-col h-dvh shrink-0
          bg-[#0b0b0b] border-r border-[#262626]
          transition-all duration-300
          w-[280px]
          ${collapsed ? "md:w-[72px]" : "md:w-[260px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Mobile Close Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
          className="md:hidden absolute top-4 right-4 z-10 p-2 rounded-lg text-gray-400 hover:text-orange-500 hover:bg-[#202020]"
        >
          <X size={20} />
        </button>

        {/* Desktop Collapse Button */}
        <button
          type="button"
          onClick={() => setCollapsed((previous) => !previous)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden md:flex absolute -right-3 top-6 z-20 w-7 h-7 rounded-full items-center justify-center bg-[#202020] border border-[#333] text-gray-400 hover:text-orange-500 hover:border-orange-500 transition"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
