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
      <div className="flex justify-center items-center h-screen flex-col">
        <Spinner />
        <p className="mt-2 text-lg">Loading questions...</p>
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
      <div className="max-w-4xl mx-auto mt-8 space-y-6">
        <h1 className="text-3xl font-bold text-center">Exam Finished</h1>
        <p className="text-center text-lg">
          Score: {correctCount} / {questions.length} ({percent}%)
        </p>
        <p className="text-center font-semibold text-xl">
          Result:{" "}
          {percent >= 85
            ? "Excellent 🎉"
            : percent >= 70
            ? "Good 👍"
            : "Needs Improvement ⚠️"}
        </p>

        <h2 className="text-2xl font-bold mt-6">Review Questions</h2>
        <div className="space-y-4 mt-4">
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
                    ? "border-gray-300"
                    : isCorrect
                    ? "border-green-400"
                    : "border-red-400"
                }`}
              >
                <CardContent>
                  <CardTitle className="text-lg font-semibold mb-2">
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
                          className={`${
                            isCorrectOption
                              ? "font-bold text-green-700"
                              : isUserOption
                              ? "text-red-600 font-semibold"
                              : ""
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
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Random Practice Exam
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

      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {questions.map((q, idx) => {
          const isAnswered = answers[q._id] !== undefined;
          const isCurrent = idx === currentIndex;
          return (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-10 h-10 rounded border transition-colors duration-200
                ${isAnswered ? "bg-black text-white" : "bg-white"}
                ${isCurrent ? "ring-2 ring-blue-500" : ""}
                hover:bg-gray-300 hover:text-black`}
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

export default ExamPage;
