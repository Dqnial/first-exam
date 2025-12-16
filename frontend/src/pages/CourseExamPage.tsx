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
      .then((data) => setQuestions(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [courseId]);

  const handleSelect = (id: string, idx: number) => {
    const q = questions.find((q) => q._id === id);
    if (!q) return;

    // Если множественный выбор
    if (Array.isArray(q.a)) {
      setAnswers((prev) => {
        const prevArr = (prev[id] as number[]) || [];
        if (prevArr.includes(idx)) {
          return { ...prev, [id]: prevArr.filter((i) => i !== idx) };
        } else {
          return { ...prev, [id]: [...prevArr, idx] };
        }
      });
    } else {
      setAnswers((prev) => ({ ...prev, [id]: idx }));
    }
  };

  const handleFinish = () => setFinished(true);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen flex-col">
        <Spinner />
        <p className="mt-2 text-lg">Loading {courseId} questions...</p>
      </div>
    );

  if (finished) {
    const correctCount = questions.reduce((acc, q) => {
      const userAnswer = answers[q._id];
      if (Array.isArray(q.a)) {
        if (
          Array.isArray(userAnswer) &&
          userAnswer.sort().join(",") === q.a.sort().join(",")
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
      <div className="max-w-4xl mx-auto mt-8 space-y-6">
        <h1 className="text-3xl font-bold text-center">
          {courseId} Exam Finished
        </h1>
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
                userAnswer.sort().join(",") === q.a.sort().join(",")
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
                    {q.options.map((opt, i) => (
                      <p
                        key={i}
                        className={`${
                          (multiple ? (q.a as number[]).includes(i) : i === q.a)
                            ? "font-bold text-green-700"
                            : (Array.isArray(userAnswer)
                                ? userAnswer.includes(i)
                                : userAnswer === i) &&
                              !(multiple
                                ? (q.a as number[]).includes(i)
                                : i === q.a)
                            ? "text-red-600 font-semibold"
                            : ""
                        }`}
                      >
                        {opt}
                        {(multiple ? (q.a as number[]).includes(i) : i === q.a)
                          ? " (Correct)"
                          : ""}
                        {Array.isArray(userAnswer)
                          ? userAnswer.includes(i) &&
                            !(q.a as number[]).includes(i)
                            ? " (Your answer)"
                            : ""
                          : userAnswer === i && i !== q.a
                          ? " (Your answer)"
                          : ""}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Button className="mt-4" onClick={() => navigate("/")}>
          Back to Courses
        </Button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        {courseId} Practice Exam
      </h1>

      <QuestionCard
        qNumber={currentIndex + 1}
        question={currentQuestion.q}
        options={currentQuestion.options}
        selected={
          answers[currentQuestion._id] ??
          (Array.isArray(currentQuestion.a) ? [] : -1)
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

export default CourseExamPage;
