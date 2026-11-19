import { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart3, Keyboard, LogOut, Trophy } from "lucide-react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatsCard from "./components/StatsCard";
import CodeEditor, { type SessionResult } from "./components/CodeEditor";

import Progress, { type TypingSession } from "./pages/Progress";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Achievements from "./components/Achievements";
import WeeklyActivity from "./components/WeeklyActivity";
import DailyGoal from "./components/DailyGoal";
import PersonalBest from "./components/PersonalBest";
import ProtectedRoute from "./components/ProtectedRoute";

import { useAuth } from "./context/AuthContext";
import { lessonsData } from "./data/lessons";

import {
  saveTypingSession,
  getTypingSessions,
  type SaveSessionData,
} from "./services/session.service";

const COMPLETED_KEY = "chaityper-completed";
const MAX_SESSIONS = 200;

const INITIAL_STATS = {
  wpm: 0,
  cpm: 0,
  accuracy: 100,
  errors: 0,
};

type View = "practice" | "progress" | "achievements";

const loadArray = <T,>(key: string): T[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const navButtonClass = (active: boolean) =>
  `flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
    active
      ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
      : "bg-[#1b1b1b] text-gray-400 hover:text-white hover:bg-[#252525]"
  }`;

function Dashboard() {
  const [language, setLanguage] = useState("python");
  const [activeLessonId, setActiveLessonId] = useState("py-variables");
  const [view, setView] = useState<View>("practice");
  const [sessions, setSessions] = useState<TypingSession[]>([]);

  const [completedKeys, setCompletedKeys] = useState<string[]>(() =>
    loadArray<string>(COMPLETED_KEY),
  );

  const [stats, setStats] = useState(INITIAL_STATS);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const lessons = useMemo(() => lessonsData[language] ?? [], [language]);

  const activeLesson =
    lessons.find((lesson) => lesson.id === activeLessonId) ?? lessons[0];

  // Fetch typing history
  useEffect(() => {
    let mounted = true;

    const fetchSessions = async () => {
      try {
        const response = await getTypingSessions();

        if (!mounted) return;

        const formatted: TypingSession[] = response.sessions.map((s) => ({
          id: s._id,
          language: s.language,
          lesson: s.lessonTitle,
          wpm: s.wpm,
          cpm: s.cpm,
          accuracy: s.accuracy,
          errors: s.errorCount,
          duration: s.duration,
          date: s.createdAt,
        }));

        setSessions(formatted.slice(-MAX_SESSIONS));
      } catch (error) {
        console.error("Failed to fetch typing sessions:", error);
      }
    };

    setSessions([]);
    fetchSessions();

    return () => {
      mounted = false;
    };
  }, [user?.username]);

  // Persist completed lessons
  useEffect(() => {
    try {
      localStorage.setItem(COMPLETED_KEY, JSON.stringify(completedKeys));
    } catch {
      // Ignore storage errors
    }
  }, [completedKeys]);

  // Logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Completed lesson list
  const completedLessons = useMemo(
    () =>
      lessons
        .filter((lesson) =>
          completedKeys.includes(`${language}:${lesson.title}`),
        )
        .map((lesson) => lesson.title),
    [lessons, completedKeys, language],
  );

  // Update live typing statistics
  const handleStatsChange = useCallback((newStats: typeof INITIAL_STATS) => {
    setStats(newStats);
  }, []);

  const lessonTitle = activeLesson?.title;
  const lessonId = activeLesson?.id;

  // Save completed typing session
  const handleComplete = useCallback(
    async (result: SessionResult) => {
      if (!lessonTitle || !lessonId) return;

      const sessionData: SaveSessionData = {
        language: language as SaveSessionData["language"],
        lessonId,
        lessonTitle,
        wpm: result.wpm,
        cpm: result.cpm,
        accuracy: result.accuracy,
        errors: result.errors,
        duration: result.duration,
        completed: result.completed,
      };

      try {
        const response = await saveTypingSession(sessionData);

        const savedSession: TypingSession = {
          id: response.session._id,
          language: response.session.language,
          lesson: response.session.lessonTitle,
          wpm: response.session.wpm,
          cpm: response.session.cpm,
          accuracy: response.session.accuracy,
          errors: response.session.errorCount,
          duration: response.session.duration,
          date: response.session.createdAt,
        };

        setSessions((previous) =>
          [...previous, savedSession].slice(-MAX_SESSIONS),
        );
      } catch (error) {
        console.error("Session save failed:", error);
      }

      if (result.completed) {
        const key = `${language}:${lessonTitle}`;

        setCompletedKeys((previous) =>
          previous.includes(key) ? previous : [...previous, key],
        );
      }
    },
    [language, lessonTitle, lessonId],
  );

  const resetStats = () => {
    setStats(INITIAL_STATS);
  };

  // Language selection
  const handleLanguageChange = (newLanguage: string) => {
    const nextLessons = lessonsData[newLanguage];

    if (!nextLessons?.length) return;

    setLanguage(newLanguage);
    setActiveLessonId(nextLessons[0].id);
    resetStats();
    setView("practice");
  };

  // Lesson selection
  const handleLessonChange = (title: string) => {
    const lesson = lessons.find((item) => item.title === title);

    if (!lesson) return;

    setActiveLessonId(lesson.id);
    resetStats();
    setView("practice");
  };

  if (!activeLesson) {
    return (
      <div className="flex h-dvh items-center justify-center bg-[#0b0b0b] text-gray-400">
        No lessons available for this language.
      </div>
    );
  }

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#0b0b0b] text-white">
      {/* Sidebar */}
      <Sidebar
        language={language}
        setLanguage={handleLanguageChange}
        activeLesson={activeLesson.title}
        setActiveLesson={handleLessonChange}
        lessons={lessons.map((lesson) => lesson.title)}
        completedLessons={completedLessons}
        stats={{
          wpm: stats.wpm,
          accuracy: stats.accuracy,
        }}
        onAchievements={() => setView("achievements")}
      />

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center gap-2 border-b border-[#262626] bg-[#111111] pr-2 sm:pr-4">
          <div className="flex-1 min-w-0 pl-12 md:pl-0">
            <Header
              activeLesson={activeLesson.title}
              language={language}
              userName={user?.username ?? "Guest"}
            />
          </div>

          {/* User and Logout */}
          <div className="flex items-center gap-2 shrink-0">
            {user && (
              <span className="hidden xl:block text-sm text-gray-400 max-w-[140px] truncate">
                {user.username}
              </span>
            )}

            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
              className="flex items-center gap-2 px-2 sm:px-4 py-2 rounded-lg bg-[#1b1b1b] text-gray-300 hover:bg-red-500 hover:text-white transition-all duration-200"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline text-sm">Logout</span>
            </button>
          </div>
        </div>

        {/* Page Navigation */}
        <nav
          aria-label="Dashboard navigation"
          className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 md:px-7 pt-4 flex-wrap"
        >
          <button
            type="button"
            onClick={() => setView("practice")}
            aria-pressed={view === "practice"}
            className={navButtonClass(view === "practice")}
          >
            <Keyboard size={16} />
            Practice
          </button>

          <button
            type="button"
            onClick={() => setView("progress")}
            aria-pressed={view === "progress"}
            className={navButtonClass(view === "progress")}
          >
            <BarChart3 size={16} />
            Progress
          </button>

          <button
            type="button"
            onClick={() => setView("achievements")}
            aria-pressed={view === "achievements"}
            className={navButtonClass(view === "achievements")}
          >
            <Trophy size={16} />
            Achievements
          </button>
        </nav>

        {/* Dashboard Content */}
        <div className="dashboard-content flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-3 sm:p-5 md:p-7">
          {view === "practice" ? (
            <div className="space-y-5 sm:space-y-6">
              {/* Dashboard Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                <DailyGoal sessions={sessions} dailyTarget={3} />

                <WeeklyActivity sessions={sessions} />

                <PersonalBest sessions={sessions} />
              </div>

              {/* Live Statistics */}
              <StatsCard
                wpm={stats.wpm}
                cpm={stats.cpm}
                accuracy={stats.accuracy}
                errors={stats.errors}
              />

              {/* Typing Editor */}
              <CodeEditor
                key={`${language}-${activeLesson.id}`}
                code={activeLesson.code}
                onStatsChange={handleStatsChange}
                onComplete={handleComplete}
              />
            </div>
          ) : view === "progress" ? (
            <Progress sessions={sessions} onBack={() => setView("practice")} />
          ) : (
            <Achievements sessions={sessions} />
          )}
        </div>
      </main>
    </div>
  );
}

// Main Application with Routing
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />

        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />

          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
