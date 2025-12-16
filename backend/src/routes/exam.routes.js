import express from "express";
import Question from "../models/Question.js";

const router = express.Router();

// GET /api/exam/start
// Отдаёт 60 случайных вопросов
router.get("/start", async (req, res) => {
  try {
    // получаем все вопросы
    const allQuestions = await Question.find();

    // рандомим 60 уникальных
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 60);

    // не отправляем правильный ответ
    const questionsToSend = selected.map((q) => ({
      _id: q._id,
      q: q.q,
      a: q.a,
      options: q.options,
      topic: q.topic,
    }));

    res.json(questionsToSend);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch questions" });
  }
});

export default router;
