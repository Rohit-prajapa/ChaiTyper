import { Code2, Check } from "lucide-react";

interface LanguageSelectorProps {
  language: string;
  setLanguage: (language: string) => void;
}

const languages = [
  {
    id: "javascript",
    label: "JS",
    name: "JavaScript",
    color: "text-yellow-400",
  },
  {
    id: "python",
    label: "PY",
    name: "Python",
    color: "text-blue-400",
  },
  {
    id: "cpp",
    label: "C++",
    name: "C++",
    color: "text-purple-400",
  },
];

const LanguageSelector = ({ language, setLanguage }: LanguageSelectorProps) => {
  return (
    <div className="bg-[#171717] border border-[#292929] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Code2 size={18} className="text-orange-500" />

        <h3 className="text-white font-semibold">Select Language</h3>
      </div>

      <div
        className="grid grid-cols-3 gap-3"
        role="radiogroup"
        aria-label="Programming language"
      >
        {languages.map((item) => {
          const active = language === item.id;

          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setLanguage(item.id)}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-lg border
              transition-all duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60
              ${
                active
                  ? "bg-orange-500/10 border-orange-500 shadow-lg shadow-orange-500/10"
                  : "bg-[#202020] border-[#333] hover:border-orange-500/50 hover:bg-[#252525]"
              }`}
            >
              <span className={`text-lg font-bold ${item.color}`}>
                {item.label}
              </span>

              <span
                className={`text-xs ${active ? "text-gray-200" : "text-gray-400"}`}
              >
                {item.name}
              </span>

              {active && (
                <Check
                  size={15}
                  className="absolute top-2 right-2 text-orange-500"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageSelector;
