import express from "express";
import { getAdminAnalytics, getUserbyId } from "../controllers/adminController.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to fetch analytics for admin dashboard
router.get("/analytics", verifyAdmin, getAdminAnalytics);
router.get("/:id", getUserbyId);

export default router;
