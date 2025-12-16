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
    // Считаем правильные ответы по ключу a из бэкенда
    const correctCount = Object.entries(answers).reduce((acc, [id, idx]) => {
      const q = questions.find((q) => q._id === id);
      if (!q) return acc;
      if (idx === q.a) return acc + 1;
      return acc;
    }, 0);

    const percent = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="max-w-xl mx-auto mt-10 space-y-4">
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
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Practice Exam</h1>
      {questions.map((q, idx) => (
        <QuestionCard
          key={q._id}
          qNumber={idx + 1}
          question={q.q}
          options={q.options}
          selected={answers[q._id]}
          onSelect={(optIdx) => handleSelect(q._id, optIdx)}
        />
      ))}
      <Button className="w-full mt-4" onClick={handleFinish}>
        Finish Exam
      </Button>
    </div>
  );
};

export default ExamPage;
