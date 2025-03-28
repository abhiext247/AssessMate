import Assessment from "../models/Assessment.js";
import nodemailer from "nodemailer";

// Fetch all assessments created by the logged-in user
export const getCreatorAssessments = async (req, res) => {
  const {userId} = req.params
  // console.log("User ID::  ",userId)
  try {
    const assessments = await Assessment.find({ creator: userId });
     console.log(assessments) //debugging

    if (!assessments.length) {
      return res.status(404).json({ message: "No assessments found for this user" });
    }

    res.json(assessments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch details of a specific assessment (including student attempts)
export const getAssessmentDetails = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id).populate("attempts.student", "name email");
    if (!assessment) return res.status(404).json({ message: "Assessment not found" });

    res.json(assessment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Send an email to a student about their assessment score
export const sendAssessmentEmail = async (req, res) => {
  const { studentEmail, studentName, assessmentName, description, score } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: studentEmail,
    subject: `Your Score for "${assessmentName}"`,
    text: `Hello ${studentName},\n\nYou recently attempted "${assessmentName}".\n\nAssessment Description: ${description}\nYour Score: ${score}/100\n\nBest Regards,\nAssessMate Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: `Email sent to ${studentEmail}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send email" });
  }
};

// Create an assessment (Only for Creators)
export const createAssessment = async (req, res) => {
  if (req.user.role !== "creator") {
    return res.status(403).json({ message: "Only creators can create assessments" });
  }

  const { title,description,timeLimit,creator,questions,attempts } = req.body;
  try {
    const assessment = await Assessment.create({ title,description,timeLimit, creator, questions,attempts });
    res.status(201).json(assessment);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all assessments (Accessible by Admins and Students)
export const getAllAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find();
    // console.log("all assessments are: ", assessments)//debugging
    if (!assessments.length) {
      return res.status(404).json({ message: "No assessments found" });
    }
    res.status(200).json(assessments);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get a single assessment
export const getAssessmentById = async (req, res) => {
  try {
    // console.log("Hello :: ",req.params.id)
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }
    res.status(200).json(assessment);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
