import express from "express";
import Question from "../models/Question.js";

const router = express.Router();

// GET /api/exam/start
// 60 случайных вопросов
router.get("/start", async (req, res) => {
  try {
    const allQuestions = await Question.find();
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 60);

    // Можно не отправлять правильный ответ, если надо скрыть
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

// GET /api/exam/course/:topic
// Все вопросы конкретного курса
router.get("/course/:topic", async (req, res) => {
  try {
    const topic = req.params.topic;
    const questions = await Question.find({
      topic: { $regex: new RegExp(`^${topic}$`, "i") },
    });

    res.json(
      questions.map((q) => ({
        _id: q._id,
        q: q.q,
        a: q.a,
        options: q.options,
        topic: q.topic,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch course questions" });
  }
});

export default router;
