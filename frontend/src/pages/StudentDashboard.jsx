import React, { useState, useEffect, useContext } from 'react'
import { fetchAssessmentDetails, fetchAssessments } from '../services/assessmentService.js'
import { findUserbyId } from '../services/adminService.js'
import AuthContext from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { all } from 'axios'


const StudentDashboard = () => {

  const { user, token,SelectedAssessment, setSelectedAssessment } = useContext(AuthContext);
  const [allAssessments, setallAssessments] = useState([]);
  const [creatorNames, setCreatorNames] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      console.error("No token available, cannot fetch assessments.");
      return;
    }


    const getallAssessments = async () => {
      try {
        setLoading(true);
        const data = await fetchAssessments(token);
        console.log("Fetched all-assessments are as follows in studentDashboard:", data); // Debugging log
        if (Array.isArray(data)) {
          setallAssessments(data);
          await fetchCreatorNames(data);
        } else {
          setallAssessments([]); // Fallback to prevent errors
        }
      } catch (error) {
        console.error("Failed to fetch assessments", error);
        setallAssessments([]); // Ensure assessments is an array
      } finally {
        setLoading(false);
      }
    };

    if (token) getallAssessments();
  }, [token]);

  // Function to fetch creator names for all assessments
  const fetchCreatorNames = async (assessments) => {
    const names = {};
    await Promise.all(
      assessments.map(async (assessment) => {
        if (!assessment.creator) return;
        const user = await findUserbyId(assessment.creator);
        if (user && user.name) {
          names[assessment.creator] = user.name;
        } else {
          names[assessment.creator] = "Unknown"; // Fallback if user not found
        }
      })
    );
    setCreatorNames(names);
  };

  const TakeAssessmentClickHandler = async (assessmentId) => {
    setLoading(true);
    try {
      const details = await fetchAssessmentDetails(assessmentId, token);
      console.log("these are details of selected assessment: ", details)
      setSelectedAssessment(details);
      localStorage.setItem("selectedAssessment", JSON.stringify(details));
      navigate("/assessment-page")

    } catch (error) {
      console.error("Error fetching assessment details", error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-2xl font-bold">Welcome, Student {user?.name}!</h1>
      <h2 className="text-xl font-semibold mt-6">All Available Assessments</h2>

      {loading ? (
        <p>Loading...</p>
      ) : allAssessments.length > 0 ? (
        <ul className="mt-4">
          {allAssessments.map((assessment) => (
            <li
              key={assessment?._id}
              className="p-4 border rounded hover:bg-blue-100 my-2 bg-blue-50 flex flex-row justify-between items-center"
            >
              <div>
                <h3 className="font-bold">{assessment.title}</h3>
                <h1 className='font-semibold text-black text-lg'> BY:
                  <p className='font-semibold text-blue-500 text-lg inline'> {creatorNames[assessment.creator]}</p>
                </h1>
                <p>Description: {assessment.description}</p>
                <p className="text-gray-600">Attempted by: {assessment.attempts.length} students</p>
              </div>
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-all" onClick={() => TakeAssessmentClickHandler(assessment?._id)}>Take Assessment</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No assessments found. Start creating your assessments!</p>
      )}
    </div>
  )
}

export default StudentDashboard
