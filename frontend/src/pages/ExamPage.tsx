import { useEffect, useState } from "react";
import QuestionCard from "@/components/QuestionCard";
import { fetchQuestions } from "@/api/examApi";
import type { Question } from "@/api/examApi";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const ExamPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchQuestions()
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSelect = (id: string, idx: number) => {
    setAnswers((prev) => ({ ...prev, [id]: idx }));
  };

  const handleFinish = () => setFinished(true);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
        <p className="ml-2 text-lg">Loading questions...</p>
      </div>
    );
  }

  if (finished) {
    const correctCount = Object.entries(answers).reduce((acc, [id, idx]) => {
      const q = questions.find((q) => q._id === id);
      if (!q) return acc;
      if (idx === q.a) return acc + 1;
      return acc;
    }, 0);

    const percent = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="max-w-4xl mx-auto mt-10 space-y-4">
        <h1 className="text-2xl font-bold">Exam Finished</h1>
        <p>
          Correct answers: {correctCount} / {questions.length}
        </p>
        <p>Score: {percent}%</p>
        <p className="font-semibold">
          Result:{" "}
          {percent >= 85
            ? "Excellent"
            : percent >= 70
            ? "Good"
            : "Needs Improvement"}
        </p>

        <div className="space-y-2 mt-6">
          {questions.map((q, idx) => {
            const userAnswer = answers[q._id];
            const isCorrect = userAnswer === q.a;
            return (
              <div
                key={q._id}
                className={`p-4 border rounded ${
                  userAnswer === undefined
                    ? "bg-white"
                    : isCorrect
                    ? "bg-green-100"
                    : "bg-red-100"
                }`}
              >
                <p className="font-medium">
                  {idx + 1}. {q.q}
                </p>
                {q.options.map((opt, i) => (
                  <p
                    key={i}
                    className={`ml-4 ${
                      i === q.a
                        ? "font-bold text-green-700"
                        : i === userAnswer
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {opt}
                    {i === q.a ? " (Correct)" : ""}
                    {i === userAnswer && i !== q.a ? " (Your answer)" : ""}
                  </p>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Practice Exam</h1>

      <QuestionCard
        qNumber={currentIndex + 1}
        question={currentQuestion.q}
        options={currentQuestion.options}
        selected={answers[currentQuestion._id]}
        onSelect={(optIdx) => handleSelect(currentQuestion._id, optIdx)}
      />

      <div className="flex flex-wrap gap-2 mt-4">
        {questions.map((q, idx) => {
          const isAnswered = answers[q._id] !== undefined;
          const isCurrent = idx === currentIndex;
          return (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`
                w-10 h-10 rounded border transition-colors duration-200
                ${isAnswered ? "bg-black text-white" : "bg-white"}
                ${isCurrent ? "ring-2 ring-blue-500" : ""}
                hover:bg-gray-300 hover:text-black
              `}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      <Button className="w-full mt-4" onClick={handleFinish}>
        Finish Exam
      </Button>
    </div>
  );
};

export default ExamPage;
