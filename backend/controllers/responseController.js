import Response from "../models/Response.js";
import Assessment from "../models/Assessment.js";
import User from "../models/User.js";

  
// export const submitResponse = async (req, res) => {
//   try {
//     const { assessmentId, answers, finalScore } = req.body;
//     const userId = req.user._id;// Extract user ID from JWT token
//     console.log("user id at submitresponse in rescontroller: ",userId);//debugging

//     // Fetch student details
//     const student = await User.findById(userId);
//     if (!student) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const newResponse = new Response({ assessmentId, userId, answers, score: finalScore, name: student.name, email: student.email });
//     await newResponse.save();

//     res.status(201).json({ message: "Response submitted successfully", score });
//   } catch (error) {
//     res.status(500).json({ message: "Error submitting response", error });
//   }
// };

export const submitResponse = async (req, res) => {
  try {
    const { assessmentId, answers, finalScore } = req.body;
    const userId = req.user._id; // Extract user ID from JWT token
    console.log("User ID at submitResponse in resController:", userId); // Debugging

    // Fetch student details
    const student = await User.findById(userId);
    if (!student) {
      return res.status(404).json({ message: "User not found" });
    }

    // Save the response in the Response collection
    const newResponse = new Response({
      assessmentId,
      userId,
      answers,
      score: finalScore,
      name: student.name,
      email: student.email,
    });
    await newResponse.save();

    // Update the corresponding assessment's attempts array
    const updatedAssessment = await Assessment.findByIdAndUpdate(
      assessmentId,
      {
        $push: {
          attempts: {
            student: userId,
            name: student.name,
            email: student.email,
            score: finalScore,
          },
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedAssessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    res.status(201).json({
      message: "Response submitted successfully and assessment attempts updated",
      score: finalScore,
      updatedAssessment,
    });
  } catch (error) {
    console.error("Error in submitResponse:", error);
    res.status(500).json({ message: "Error submitting response", error });
  }
};


// Fetch student results
export const getStudentResults = async (req, res) => {
  try {
    const studentId = req.user.id;
    const results = await Response.find({ studentId }).populate("assessmentId", "title");
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching results", error });
  }
};

export const getAssessmentResponses = async (req, res) => {
  try {
    const { assessmentId } = req.params;

    const responses = await Response.find({ assessmentId })
      .populate("userId", "name email") // Fetch user name & email
      .populate("assessmentId", "title"); // Fetch assessment title

    if (!responses || responses.length === 0) {
      return res.status(404).json({ message: "No responses found for this assessment." });
    }

    res.status(200).json(responses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assessment responses", error });
  }
};


