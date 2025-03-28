import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL + "/api/responses";

// Submit responses
export const submitResponse = async (assessmentId, answers, finalScore, token) => {
  const response = await axios.post(
    `${API_URL}/submit`,
    { assessmentId, answers, finalScore},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Fetch student results
export const fetchStudentResults = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Fetch responses for a specific assessment
export const fetchAssessmentResponses = async (assessmentId, token) => {
  const response = await axios.get(`${API_URL}/${assessmentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
