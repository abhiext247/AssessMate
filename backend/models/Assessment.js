import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true }, // Add description field
    timeLimit: { type: Number, required: true }, // Time limit in minutes
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
   
    questions: [
      {
        questionText: { type: String, required: true },
        options: [{ type: String, required: true }], // Array of options
        correctAnswer: { type: String, required: true }, // Correct option
      },
    ],
    attempts: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: { type: String, required: true },
        email: { type: String, required: true },
        score: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Assessment = mongoose.model("Assessment", assessmentSchema);
export default Assessment;
