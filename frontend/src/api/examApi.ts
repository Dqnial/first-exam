export interface Question {
  _id: string;
  q: string;
  a: number;
  options: string[];
  topic: string;
}

export const fetchQuestions = async (): Promise<Question[]> => {
  const res = await fetch(
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api/exam/start"
      : "/api/exam/start"
  );
  if (!res.ok) throw new Error("Failed to fetch questions");
  return res.json();
};
