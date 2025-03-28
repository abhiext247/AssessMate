import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assessment", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },  // Store student's name
  email: { type: String, required: true }, // Store student's email
  answers: [{ questionId: String, selectedOption: String }],
  score: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now },
});

const Response = mongoose.model("Response", responseSchema);
export default Response;
