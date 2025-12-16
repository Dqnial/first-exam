import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  q: { type: String, required: true },
  options: { type: [String], required: true },
  a: { type: mongoose.Schema.Types.Mixed, required: true },
  topic: { type: String, required: true },
});

export default mongoose.model("Question", questionSchema);
