import React, { useState, useEffect, useContext } from 'react'
import {fetchAssessmentDetails, fetchAssessments} from '../services/assessmentService.js'
import {findUserbyId} from '../services/adminService.js'
import AuthContext from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'



const AdminDashboard = () => {
  const { user, token, setSelectedAssessment} = useContext(AuthContext);
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
        console.log("Fetched all-assessments are as follows in adminDashboard:", data); // Debugging log
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

  const handleAssessmentClick = async (assessmentId) => {
      setLoading(true);
      try {
        const details = await fetchAssessmentDetails(assessmentId, token);
        setSelectedAssessment(details);
        localStorage.setItem("selectedAssessment", JSON.stringify(details));
        navigate("/assessment-details")
  
      } catch (error) {
        console.error("Error fetching assessment details", error);
      } finally {
        setLoading(false);
      }
    };

  

  return (
    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-2xl font-bold">Welcome, Admin {user?.name}!</h1>
      <h2 className="text-xl font-semibold mt-6">All Assessments</h2>

      {loading ? (
        <p>Loading...</p>
      ) : allAssessments.length > 0 ? (
        <ul className="mt-4">
          {allAssessments.map((assessment) => (
            <li
              key={assessment._id}
              className="p-4 border rounded cursor-pointer hover:bg-blue-100 my-2 bg-blue-50"
              onClick={() => handleAssessmentClick(assessment._id)}
            >
              <h3 className="font-bold">{assessment.title}</h3>
              <p className='font-semibold text-black text-lg'> BY: 
                <p className='font-semibold text-blue-500 text-lg inline'> {creatorNames[assessment.creator]}</p>
                </p>
              <p>Description: {assessment.description}</p>
              <p className="text-gray-600">Attempted by: {assessment.attempts.length} students</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No assessments found. Start creating your assessments!</p>
      )}
    </div>
  )
}

export default AdminDashboard
