import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QuestionCard from "@/components/QuestionCard";
import { fetchCourseQuestions } from "@/api/examApi";
import type { Question } from "@/api/examApi";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const CourseExamPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: number | number[] }>(
    {}
  );
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!courseId) return;
    fetchCourseQuestions(courseId)
      .then(setQuestions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [courseId]);

  const handleSelect = (id: string, idx: number) => {
    const q = questions.find((q) => q._id === id);
    if (!q) return;

    if (Array.isArray(q.a)) {
      setAnswers((prev) => {
        const prevArr = Array.isArray(prev[id])
          ? [...(prev[id] as number[])]
          : [];
        const newArr = prevArr.includes(idx)
          ? prevArr.filter((i) => i !== idx)
          : [...prevArr, idx];
        return { ...prev, [id]: newArr };
      });
    } else {
      setAnswers((prev) => ({ ...prev, [id]: idx }));
    }
  };

  const handleFinish = () => setFinished(true);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <Spinner />
        <p className="mt-2 text-lg text-muted-foreground">
          Loading {courseId} questions...
        </p>
      </div>
    );
  }

  if (finished) {
    const correctCount = questions.reduce((acc, q) => {
      const userAnswer = answers[q._id];
      const multiple = Array.isArray(q.a);

      if (multiple) {
        if (
          Array.isArray(userAnswer) &&
          [...userAnswer].sort().join(",") ===
            [...(q.a as number[])].sort().join(",")
        ) {
          return acc + 1;
        }
      } else if (userAnswer === q.a) {
        return acc + 1;
      }
      return acc;
    }, 0);

    const percent = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="max-w-4xl mx-auto mt-8 space-y-6 bg-background text-foreground p-4">
        <h1 className="text-3xl font-bold text-center">
          {courseId} Exam Finished
        </h1>

        <p className="text-center text-lg">
          Score: {correctCount} / {questions.length} ({percent}%)
        </p>

        <p className="text-center text-xl font-semibold">
          Result:{" "}
          {percent >= 85
            ? "Excellent 🎉"
            : percent >= 70
            ? "Good 👍"
            : "Needs Improvement ⚠️"}
        </p>

        <h2 className="text-2xl font-bold mt-6">Review Questions</h2>

        <div className="space-y-4">
          {questions.map((q, idx) => {
            const userAnswer = answers[q._id];
            const multiple = Array.isArray(q.a);
            const isCorrect = multiple
              ? Array.isArray(userAnswer) &&
                [...userAnswer].sort().join(",") ===
                  [...(q.a as number[])].sort().join(",")
              : userAnswer === q.a;

            return (
              <Card
                key={q._id}
                className={`bg-background border ${
                  userAnswer === undefined
                    ? "border-border"
                    : isCorrect
                    ? "border-green-500 dark:border-green-400"
                    : "border-red-500 dark:border-red-400"
                }`}
              >
                <CardContent>
                  <CardTitle className="mb-2 text-lg font-semibold">
                    {idx + 1}. {q.q}
                  </CardTitle>

                  <div className="ml-4 space-y-1">
                    {q.options.map((opt, i) => {
                      const isCorrectOption = multiple
                        ? (q.a as number[]).includes(i)
                        : i === q.a;
                      const isUserOption = Array.isArray(userAnswer)
                        ? userAnswer.includes(i)
                        : userAnswer === i;

                      return (
                        <p
                          key={i}
                          className={
                            isCorrectOption
                              ? "font-bold text-green-600 dark:text-green-400"
                              : isUserOption
                              ? "font-semibold text-red-600 dark:text-red-400"
                              : "text-muted-foreground"
                          }
                        >
                          {opt}
                          {isCorrectOption && " (Correct)"}
                          {isUserOption && !isCorrectOption && " (Your answer)"}
                        </p>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Button className="mt-4 w-full" onClick={() => navigate("/")}>
          Back to Courses
        </Button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto p-4 bg-background text-foreground">
      <h1 className="mb-4 text-2xl font-bold text-center">
        {courseId} Practice Exam
      </h1>

      <QuestionCard
        qNumber={currentIndex + 1}
        question={currentQuestion.q}
        options={currentQuestion.options}
        selected={
          Array.isArray(currentQuestion.a)
            ? (answers[currentQuestion._id] as number[]) || []
            : (answers[currentQuestion._id] as number) ?? -1
        }
        onSelect={(optIdx) => handleSelect(currentQuestion._id, optIdx)}
        multiple={Array.isArray(currentQuestion.a)}
      />

      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {questions.map((q, idx) => {
          const isAnswered = answers[q._id] !== undefined;
          const isCurrent = idx === currentIndex;

          return (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-10 h-10 rounded border transition
                ${
                  isAnswered
                    ? "bg-primary text-primary-foreground"
                    : "bg-background"
                }
                ${isCurrent ? "ring-2 ring-ring" : ""}
                hover:bg-muted`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      <Button className="w-full mt-6" onClick={handleFinish}>
        Finish Exam
      </Button>
    </div>
  );
};

export default CourseExamPage;
