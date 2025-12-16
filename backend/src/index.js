import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import connectDB from "./db.js";
import examRoutes from "./routes/exam.routes.js";

const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT || 4000;

dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/api/exam", examRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
