import { useEffect, useState } from "react";
import QuestionCard from "@/components/QuestionCard";
import { fetchRandomQuestions } from "@/api/examApi";
import type { Question } from "@/api/examApi";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const ExamPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: number | number[] }>(
    {}
  );
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchRandomQuestions()
      .then((data) => setQuestions(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (id: string, idx: number) => {
    const q = questions.find((q) => q._id === id);
    if (!q) return;

    const multiple = Array.isArray(q.a);

    setAnswers((prev) => {
      if (multiple) {
        const prevArr = Array.isArray(prev[id])
          ? [...(prev[id] as number[])]
          : [];
        const newArr = prevArr.includes(idx)
          ? prevArr.filter((i) => i !== idx)
          : [...prevArr, idx];
        return { ...prev, [id]: newArr };
      } else {
        return { ...prev, [id]: idx };
      }
    });
  };

  const handleFinish = () => setFinished(true);

  if (loading)
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background text-foreground">
        <Spinner />
        <p className="mt-3 text-sm text-muted-foreground">
          Loading questions...
        </p>
      </div>
    );

  if (finished) {
    const correctCount = questions.reduce((acc, q) => {
      const userAnswer = answers[q._id];
      const multiple = Array.isArray(q.a);

      if (multiple) {
        if (Array.isArray(userAnswer)) {
          const sortedUser = [...userAnswer].sort();
          const sortedCorrect = [...(q.a as number[])].sort();
          if (sortedUser.join(",") === sortedCorrect.join(",")) {
            return acc + 1;
          }
        }
      } else if (userAnswer === q.a) {
        return acc + 1;
      }
      return acc;
    }, 0);

    const percent = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="mx-auto mt-8 max-w-4xl space-y-6 px-4 text-foreground">
        <div className="rounded-xl border bg-card p-6 text-center shadow-sm">
          <h1 className="text-3xl font-bold">Exam Finished</h1>
          <p className="mt-2 text-muted-foreground">
            Score: {correctCount} / {questions.length} ({percent}%)
          </p>
          <p className="mt-3 text-xl font-semibold">
            {percent >= 85
              ? "Excellent 🎉"
              : percent >= 70
              ? "Good 👍"
              : "Needs Improvement ⚠️"}
          </p>
        </div>

        <h2 className="text-2xl font-bold">Review Questions</h2>

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
                className={`border ${
                  userAnswer === undefined
                    ? "border-border"
                    : isCorrect
                    ? "border-green-500/50"
                    : "border-red-500/50"
                }`}
              >
                <CardContent className="space-y-3">
                  <CardTitle className="text-base font-semibold">
                    {idx + 1}. {q.q}
                  </CardTitle>

                  <div className="space-y-1">
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
                          className={`text-sm ${
                            isCorrectOption
                              ? "font-semibold text-green-600 dark:text-green-400"
                              : isUserOption
                              ? "font-semibold text-red-600 dark:text-red-400"
                              : "text-muted-foreground"
                          }`}
                        >
                          {opt}
                          {isCorrectOption ? " (Correct)" : ""}
                          {isUserOption && !isCorrectOption
                            ? " (Your answer)"
                            : ""}
                        </p>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 text-foreground">
      <h1 className="text-center text-2xl font-bold">Random Practice Exam</h1>

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

      <div className="flex flex-wrap justify-center gap-2">
        {questions.map((q, idx) => {
          const isAnswered = answers[q._id] !== undefined;
          const isCurrent = idx === currentIndex;

          return (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition
                ${
                  isAnswered
                    ? "bg-primary text-primary-foreground"
                    : "bg-background"
                }
                ${
                  isCurrent
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : ""
                }
                hover:bg-muted`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      <Button className="w-full" onClick={handleFinish}>
        Finish Exam
      </Button>
    </div>
  );
};

export default ExamPage;
