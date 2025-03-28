import express from "express";
import { submitResponse, getStudentResults, getAssessmentResponses } from "../controllers/responseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/", protect, getStudentResults);
router.post("/submit", protect, submitResponse);
router.get("/:assessmentId", protect, getAssessmentResponses); // Fetch responses for a specific assessment

export default router;
