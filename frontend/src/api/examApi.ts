export interface Question {
  _id: string;
  q: string;
  a: number | number[]; // single or multiple correct answers
  options: string[];
  topic: string;
}

// Случайный экзамен
export const fetchRandomQuestions = async (): Promise<Question[]> => {
  const res = await fetch(
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api/exam/start"
      : "/api/exam/start"
  );
  if (!res.ok) throw new Error("Failed to fetch questions");
  return res.json();
};

// Все вопросы конкретного курса
export const fetchCourseQuestions = async (
  topic: string
): Promise<Question[]> => {
  const res = await fetch(
    import.meta.env.MODE === "development"
      ? `http://localhost:5000/api/exam/course/${encodeURIComponent(topic)}`
      : `/api/exam/course/${encodeURIComponent(topic)}`
  );
  if (!res.ok) throw new Error("Failed to fetch course questions");
  return res.json();
};
