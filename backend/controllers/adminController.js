import Assessment from "../models/Assessment.js";
import Response from "../models/Response.js";
import User from "../models/User.js";

export const getAdminAnalytics = async (req, res) => {
  try {
    const totalAssessments = await Assessment.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalResponses = await Response.countDocuments();

    const assessmentStats = await Assessment.aggregate([
      {
        $lookup: {
          from: "responses",
          localField: "_id",
          foreignField: "assessmentId",
          as: "responses",
        },
      },
      {
        $project: {
          title: 1,
          totalResponses: { $size: "$responses" },
          averageScore: { $avg: "$responses.score" },
        },
      },
    ]);

    res.json({
      totalAssessments,
      totalStudents,
      totalResponses,
      assessmentStats,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching analytics", error });
  }
};

export const getUserbyId = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: user?.token });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
