import { useCallback, useEffect, useRef, useState } from "react";

import {
  RotateCcw,
  CheckCircle2,
  Clock,
  Trophy,
  Keyboard,
  Play,
  Target,
  Zap,
} from "lucide-react";

export interface SessionResult {
  wpm: number;
  cpm: number;
  accuracy: number;
  errors: number;
  duration: number;
  completed: boolean;
}

interface CodeEditorProps {
  code: string;
  onStatsChange?: (stats: {
    wpm: number;
    cpm: number;
    accuracy: number;
    errors: number;
  }) => void;
  onComplete?: (result: SessionResult) => void;
}

const DURATIONS = [30, 60, 120];

const CodeEditor = ({ code, onStatsChange, onComplete }: CodeEditorProps) => {
  const [typed, setTyped] = useState("");
  const [duration, setDuration] = useState(60);
  const [remaining, setRemaining] = useState(60);
  const [elapsed, setElapsed] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const startTimeRef = useRef<number | null>(null);
  const typedRef = useRef("");
  const reportedRef = useRef(false);

  const statsCallbackRef = useRef(onStatsChange);
  const completeCallbackRef = useRef(onComplete);

  useEffect(() => {
    statsCallbackRef.current = onStatsChange;
    completeCallbackRef.current = onComplete;
  }, [onStatsChange, onComplete]);

  // Calculate typing statistics
  const errors = [...typed].filter(
    (char, index) => char !== code[index],
  ).length;

  const correct = typed.length - errors;

  const accuracy =
    typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100;

  const elapsedMinutes = Math.max(elapsed, 1) / 60;

  const wpm = elapsed > 0 ? Math.round(correct / 5 / elapsedMinutes) : 0;

  const cpm = elapsed > 0 ? Math.round(correct / elapsedMinutes) : 0;

  const completed = code.length > 0 && typed.length >= code.length;

  const testFinished = finished || completed;

  const progress = code.length
    ? Math.min(100, Math.round((typed.length / code.length) * 100))
    : 0;

  // Update live statistics
  useEffect(() => {
    statsCallbackRef.current?.({
      wpm,
      cpm,
      accuracy,
      errors,
    });
  }, [wpm, cpm, accuracy, errors]);

  // Reset editor
  const resetTest = useCallback(
    (seconds?: number) => {
      const nextDuration = typeof seconds === "number" ? seconds : duration;

      typedRef.current = "";
      setTyped("");
      setDuration(nextDuration);
      setRemaining(nextDuration);
      setElapsed(0);
      setStarted(false);
      setFinished(false);

      startTimeRef.current = null;
      reportedRef.current = false;

      inputRef.current?.focus();
    },
    [duration],
  );

  // Reset when lesson changes
  useEffect(() => {
    resetTest();
    // Reset only when the lesson code changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  // Countdown timer
  useEffect(() => {
    if (!started || finished) return;

    const timer = window.setInterval(() => {
      if (startTimeRef.current === null) return;

      const currentElapsed = (Date.now() - startTimeRef.current) / 1000;

      if (currentElapsed >= duration) {
        setElapsed(duration);
        setRemaining(0);
        setStarted(false);
        setFinished(true);
        return;
      }

      setElapsed(currentElapsed);
      setRemaining(Math.max(0, Math.ceil(duration - currentElapsed)));
    }, 100);

    return () => window.clearInterval(timer);
  }, [started, finished, duration]);

  // Report completed session exactly once
  useEffect(() => {
    if (!testFinished || reportedRef.current || typed.length === 0) {
      return;
    }

    reportedRef.current = true;

    const actualDuration = Math.max(1, Math.round(elapsed));

    const finalMinutes = actualDuration / 60;

    const finalWpm = Math.round(correct / 5 / finalMinutes);
    const finalCpm = Math.round(correct / finalMinutes);

    completeCallbackRef.current?.({
      wpm: finalWpm,
      cpm: finalCpm,
      accuracy,
      errors,
      duration: Math.min(duration, actualDuration),
      completed,
    });
  }, [
    testFinished,
    typed.length,
    elapsed,
    correct,
    accuracy,
    errors,
    duration,
    completed,
  ]);

  // Start timer
  const startTest = () => {
    if (started || testFinished) return;

    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }

    setStarted(true);
  };

  // Finish when all characters are typed
  const finishIfComplete = (length: number) => {
    if (length >= code.length && code.length > 0) {
      const currentTime = startTimeRef.current;

      if (currentTime !== null) {
        const actualElapsed = Math.min(
          duration,
          (Date.now() - currentTime) / 1000,
        );

        setElapsed(actualElapsed);
        setRemaining(Math.max(0, Math.ceil(duration - actualElapsed)));
      }

      setStarted(false);
      setFinished(true);
    }
  };

  // Handle typing
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (testFinished) return;

    const value = event.target.value;

    if (value.length > code.length) return;

    if (!started && value.length > 0) {
      startTest();
    }

    typedRef.current = value;
    setTyped(value);

    finishIfComplete(value.length);
  };

  // Tab inserts four spaces
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Tab" || testFinished) return;

    event.preventDefault();

    const target = event.currentTarget;
    const start = target.selectionStart;
    const end = target.selectionEnd;

    const newValue = typed.substring(0, start) + "    " + typed.substring(end);

    if (newValue.length > code.length) return;

    if (!started) startTest();

    typedRef.current = newValue;
    setTyped(newValue);

    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.selectionStart = start + 4;
        inputRef.current.selectionEnd = start + 4;
      }
    });

    finishIfComplete(newValue.length);
  };

  // Change duration
  const changeDuration = (seconds: number) => {
    if (started || typed.length > 0 || finished) return;

    resetTest(seconds);
  };

  // Format time
  const formatTime = (seconds: number) => {
    const safeSeconds = Math.max(0, Math.ceil(seconds));
    const minutes = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0",
    )}`;
  };

  const statusText = started
    ? "Test in progress"
    : testFinished
      ? "Test finished"
      : "Ready to start";

  return (
    <section className="typing-editor w-full min-w-0 border border-[#292929] rounded-xl overflow-hidden">
      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-[#252525]">
        <div
          className="h-full bg-orange-500 transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Editor Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-[#292929]">
        <div>
          <div className="flex items-center gap-2">
            <Keyboard size={19} className="text-orange-500" />

            <h2 className="text-white font-semibold">Coding Practice</h2>
          </div>

          <p className="text-xs text-gray-500 mt-1">
            Type the code shown below
          </p>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          {/* Timer */}
          <div className="flex items-center gap-2">
            <Clock size={17} className="text-orange-500" />

            <span
              className={`font-mono text-lg font-bold tabular-nums ${
                remaining <= 10 && started ? "text-red-500" : "text-orange-500"
              }`}
            >
              {formatTime(remaining)}
            </span>
          </div>

          {/* Restart */}
          <button
            type="button"
            onClick={() => resetTest()}
            title="Restart test"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-orange-500 transition"
          >
            <RotateCcw size={16} />
            <span className="hidden sm:inline">Restart</span>
          </button>
        </div>
      </div>

      {/* Timer Selection */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-[#292929]">
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-xs text-gray-500 mr-1">DURATION</span>

          {DURATIONS.map((seconds) => (
            <button
              key={seconds}
              type="button"
              disabled={started || typed.length > 0 || finished}
              onClick={() => changeDuration(seconds)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                duration === seconds
                  ? "bg-orange-500 text-white"
                  : "bg-[#252525] text-gray-400 hover:text-white"
              }`}
            >
              {seconds}s
            </button>
          ))}
        </div>

        <span className="text-xs text-gray-500">{statusText}</span>
      </div>

      {/* Typing Area */}
      <div
        className="relative min-h-[350px] sm:min-h-[400px] p-4 sm:p-6 md:p-7 font-mono text-sm sm:text-base leading-8 cursor-text overflow-hidden"
        onClick={() => inputRef.current?.focus()}
      >
        <pre
          aria-hidden="true"
          className="typing-code whitespace-pre-wrap break-words tracking-wide"
        >
          {code.split("").map((char, index) => {
            let color = "text-[#a1a1aa]";

            if (index < typed.length) {
              color =
                typed[index] === char
                  ? "text-green-400"
                  : "text-red-500 bg-red-500/10";
            }

            const isCursor = index === typed.length && !testFinished;

            return (
              <span
                key={index}
                className={`${color} ${
                  isCursor ? "border-l-2 border-orange-500 animate-pulse" : ""
                }`}
              >
                {char}
              </span>
            );
          })}
        </pre>

        <textarea
          ref={inputRef}
          value={typed}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={testFinished}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          aria-label="Type the displayed code here"
          className="typing-input p-4 sm:p-6 md:p-7 font-mono text-sm sm:text-base leading-8 selection:bg-orange-500/20"
        />
      </div>

      {/* Editor Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-4 border-t border-[#292929]">
        <p className="text-xs text-gray-500">
          Press <span className="text-orange-500 font-semibold">Tab</span> for
          indentation
        </p>

        <p className="text-xs text-gray-500 tabular-nums">
          {typed.length}/{code.length} characters
        </p>
      </div>

      {/* Completion Result */}
      {testFinished && (
        <div className="m-3 sm:m-4 p-4 sm:p-5 rounded-xl bg-[#202020] border border-orange-500/30">
          <div className="flex items-center gap-2 mb-5">
            <Trophy size={23} className="text-orange-500" />

            <h3 className="text-white font-bold text-lg">
              {completed ? "Lesson Completed!" : "Test Finished!"}
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "WPM",
                value: wpm,
                icon: Zap,
              },
              {
                label: "CPM",
                value: cpm,
                icon: Keyboard,
              },
              {
                label: "Accuracy",
                value: `${accuracy}%`,
                icon: Target,
              },
              {
                label: "Errors",
                value: errors,
                icon: Clock,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-lg bg-[#171717] border border-[#333] p-3"
                >
                  <div className="flex items-center gap-2 text-gray-500">
                    <Icon size={14} />
                    <p className="text-xs">{item.label}</p>
                  </div>

                  <p className="text-2xl font-bold text-orange-500 mt-2 tabular-nums">
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => resetTest()}
            className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition"
          >
            <CheckCircle2 size={17} />
            Try Again
          </button>
        </div>
      )}

      {/* Start Prompt */}
      {!started && !testFinished && typed.length === 0 && (
        <div className="px-4 pb-5 flex justify-center">
          <button
            type="button"
            onClick={() => inputRef.current?.focus()}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-orange-500 transition"
          >
            <Play size={15} />
            Click here or start typing to begin
          </button>
        </div>
      )}
    </section>
  );
};

export default CodeEditor;
