import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from '../context/AuthContext'
import { fetchCreatorAssessments, fetchAssessmentDetails, sendStudentEmail } from "../services/assessmentService";

const CreatorDashboard = () => {
  const { user, token, setSelectedAssessment } = useContext(AuthContext); // Assuming user details are stored in context
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // console.log('this is token', token);
    const getAssessments = async () => {
      try {
        setLoading(true);
        const data = await fetchCreatorAssessments(token, user?._id);
        console.log("Fetched assessments are as follows:", data); // Debugging log
        if (Array.isArray(data)) {
          setAssessments(data);
        } else {
          setAssessments([]); // Fallback to prevent errors
        }
      } catch (error) {
        console.error("Failed to fetch assessments", error);
        setAssessments([]); // Ensure assessments is an array
      } finally {
        setLoading(false);
      }
    };

    if (token) getAssessments();
  }, [token]);


  const handleAssessmentClick = async (assessmentId) => {
    setLoading(true);
    try {
      const details = await fetchAssessmentDetails(assessmentId, token);
      setSelectedAssessment(details);
      localStorage.setItem("selectedAssessment", JSON.stringify(details));
      navigate("/assessment-details");

    } catch (error) {
      console.error("Error fetching assessment details", error);
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Welcome, Creator {user?.name}!</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        onClick={() => navigate("/create-assessment")}
      >
        Create New Assessment
      </button>

      <p className="mt-2 px-2">Your Total Assessments: {assessments.length}</p>


      <h2 className="text-xl font-semibold mt-6">Your Assessments</h2>
      {loading ? (
        <p>Loading...</p>
      ) : assessments.length > 0 ? (
        <ul className="mt-4">
          {assessments.map((assessment) => (
            <li
              key={assessment._id}
              className="p-4 border rounded cursor-pointer hover:bg-blue-100 my-2 bg-blue-50"
              onClick={() => handleAssessmentClick(assessment?._id)}
            >
              <h3 className="font-bold">{assessment.title}</h3>
              <p>Description: {assessment.description}</p>
              <p className="text-gray-600">Attempted by: {assessment.attempts.length} students</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No assessments found. Start creating your assessments!</p>
      )}
    </div>
  );
};

export default CreatorDashboard;

