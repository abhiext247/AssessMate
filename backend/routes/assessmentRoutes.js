import express from "express";
import { createAssessment, getAllAssessments, getAssessmentById } from "../controllers/assessmentController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { getCreatorAssessments, getAssessmentDetails, sendAssessmentEmail } from "../controllers/assessmentController.js";


const router = express.Router();

//To get all assessments
router.get("/", protect, getAllAssessments);

//Create New Assessment
router.post("/create", protect, authorizeRoles("creator"), createAssessment);
//Assessment of a particular creator
router.get("/creator-assessments/:userId", protect, authorizeRoles("creator"), getCreatorAssessments);

// get details of a perticular Assessment
router.get("/:id", protect, getAssessmentById);

// // Get details of a specific assessment
// router.get("/:id", protect, getAssessmentDetails);

// Send an email to a student about their assessment score
router.post("/send-email", protect, sendAssessmentEmail);

export default router;
