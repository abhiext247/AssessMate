import express from "express";
import dotenv from "dotenv";
import cors from "cors"; 
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import assessmentRoutes from "./routes/assessmentRoutes.js";
import responseRoutes from "./routes/responseRoutes.js";  //  Import missing routes
import adminRoutes from "./routes/adminRoutes.js";  //  Import missing routes

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());  //  CORS added

//  Ensure all routes are correctly set
app.use("/api/auth", authRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/responses", responseRoutes);
app.use("/api/admin", adminRoutes);


export default app;
