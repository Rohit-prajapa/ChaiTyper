import { BookOpen, CheckCircle2, Circle } from "lucide-react";

export interface Lesson {
  id: string;
  title: string;
  topic: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

interface LessonListProps {
  lessons: Lesson[];
  activeLesson: string;
  setActiveLesson: (id: string) => void;
  completedLessons?: string[];
}

const LessonList = ({
  lessons,
  activeLesson,
  setActiveLesson,
  completedLessons = [],
}: LessonListProps) => {
  return (
    <div className="bg-[#171717] border border-[#292929] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen size={18} className="text-orange-500" />

        <h3 className="text-white font-semibold">Lessons</h3>

        <span className="ml-auto text-xs text-gray-500">
          {lessons.length} lessons
        </span>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {lessons.map((lesson) => {
          const active = activeLesson === lesson.id;
          const completed = completedLessons.includes(lesson.id);

          return (
            <button
              key={lesson.id}
              onClick={() => setActiveLesson(lesson.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition text-left ${
                active
                  ? "bg-orange-500 border-orange-500"
                  : "bg-[#202020] border-transparent hover:border-[#444]"
              }`}
            >
              <div className="flex items-center gap-3">
                {completed ? (
                  <CheckCircle2
                    size={17}
                    className={active ? "text-white" : "text-green-400"}
                  />
                ) : (
                  <Circle
                    size={17}
                    className={active ? "text-white" : "text-gray-500"}
                  />
                )}

                <div>
                  <p
                    className={`text-sm font-medium ${
                      active ? "text-white" : "text-gray-200"
                    }`}
                  >
                    {lesson.title}
                  </p>

                  <p
                    className={`text-xs mt-1 ${
                      active ? "text-orange-100" : "text-gray-500"
                    }`}
                  >
                    {lesson.topic}
                  </p>
                </div>
              </div>

              <span
                className={`text-[10px] ${
                  active ? "text-white" : "text-gray-500"
                }`}
              >
                {lesson.difficulty}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LessonList;
