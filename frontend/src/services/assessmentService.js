import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL + "/api/assessments";


// Fetch assessments created by the logged-in user
export const fetchCreatorAssessments = async (token, userId) => {
  try {
    const response = await axios.get(`${API_URL}/creator-assessments/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw error;
  }
};

// Fetch details of a specific assessment (including student attempts)
export const fetchAssessmentDetails = async (assessmentId, token) => {
  try {
    // const response = await axios.get(${API_URL}?${assessmentId}, { 
    //   headers: { Authorization: Bearer ${token} },
    // });//  Changes made by chinmay to avoid undefined in some part of code.
    const response = await axios.get(`${API_URL}/${assessmentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching assessment details:", error);
    throw error;
  }
};

// Send an email to a student with their assessment score
export const sendStudentEmail = async (studentEmail, studentName, assessmentName, description, score, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/send-email`,
      { studentEmail, studentName, assessmentName, description, score, token },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// Fetch all assessments
// export const fetchAssessments = async () => {
//   try {
//     const response = await axios.get(API_URL);
//     console.log("assessments data at assessmentServices: ", response.data)
//     return response.data;
//   }
//   catch (error) {
//     console.error("This is error MessageChannel", error);
//   }
// };

// Fetch all assessments with Authorization token
export const fetchAssessments = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}` // Attach token in request headers
      }
    });
    
    console.log("assessments data at assessmentServices: ", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching assessments:", error.response?.data || error.message);
    return null; // Return null to avoid crashes in components
  }
};




// // Create a new assessment (for creators)
// export const createAssessment = async (assessmentData, token) => {
//   const response = await axios.post(API_URL, assessmentData, {
//     headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//   });
//   return response.data;
// };

// Create a new assessment (for creators)
export const createAssessment = async (assessmentData, token) => {
  if (!token) {
    console.error("Error: No token provided");
    throw new Error("No token provided");
  }

  // console.log("Token sent in request:", token); // Debugging

  const response = await axios.post(`${API_URL}/create`, assessmentData, {
    headers: {
      Authorization: `Bearer ${token.trim()}`, // Ensure no extra spaces
      "Content-Type": "application/json",
    },
  });

  return response.data;
};


