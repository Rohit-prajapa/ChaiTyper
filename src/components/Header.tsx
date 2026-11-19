import {
  Coffee,
  UserRound,
  Settings,
  Menu,
  UserCircle,
  Sun,
  Moon,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

interface HeaderProps {
  activeLesson: string;
  language?: string;
  userName?: string;
  onMenuClick?: () => void;
  onSettingsClick?: () => void;
}

const LANGUAGE_LABELS: Record<string, string> = {
  javascript: "JS",
  python: "PY",
  cpp: "C++",
};

const Header = ({
  activeLesson,
  language,
  userName = "Guest",
  onMenuClick,
  onSettingsClick,
}: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 w-full min-h-16 bg-[#111111]/95 backdrop-blur-xl border-b border-[#262626] flex items-center justify-between gap-2 px-3 sm:px-4 md:px-6 py-2">
      {/* Left Section */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-orange-500 hover:bg-[#1c1c1c] transition"
          >
            <Menu size={20} />
          </button>
        )}

        <div className="w-9 h-9 shrink-0 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
          <Coffee size={21} className="text-white" />
        </div>

        <div className="min-w-0">
          <h2 className="text-white font-bold text-base sm:text-lg leading-tight truncate">
            ChaiTyper
          </h2>

          <p className="hidden sm:block text-gray-500 text-xs truncate">
            Coding Typing Practice
          </p>
        </div>
      </div>

      {/* Center Section */}
      <div className="hidden lg:flex items-center gap-2 min-w-0">
        <span className="text-gray-400 text-sm whitespace-nowrap">
          Current Lesson:
        </span>

        <span className="text-orange-500 font-semibold text-sm truncate max-w-[180px]">
          {activeLesson}
        </span>

        {language && (
          <span className="px-2 py-1 rounded-md bg-[#1c1c1c] border border-[#333] text-[10px] font-bold text-gray-300">
            {LANGUAGE_LABELS[language.toLowerCase()] ?? language.toUpperCase()}
          </span>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          className="p-2 rounded-lg text-gray-400 hover:text-orange-500 hover:bg-[#1c1c1c] transition"
        >
          {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        {/* Settings */}
        <button
          type="button"
          onClick={onSettingsClick}
          aria-label="Settings"
          title="Settings"
          className="p-2 rounded-lg text-gray-400 hover:text-orange-500 hover:bg-[#1c1c1c] transition"
        >
          <Settings size={19} />
        </button>

        {/* User */}
        <div className="flex items-center gap-2 bg-[#1c1c1c] border border-[#333] rounded-full px-2 sm:px-3 py-2">
          <UserRound size={17} className="text-orange-500 shrink-0" />

          <span className="hidden xl:block text-sm text-gray-300 max-w-[110px] truncate">
            {userName}
          </span>
        </div>

        {/* Profile */}
        <Link
          to="/profile"
          title="My Profile"
          aria-label="My Profile"
          className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500 hover:border-orange-500 text-orange-500 hover:text-black rounded-full px-2 sm:px-3 py-2 transition-all duration-200"
        >
          <UserCircle size={18} />

          <span className="hidden sm:block text-sm font-medium">Profile</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
