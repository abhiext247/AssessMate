
import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { fetchAssessments, fetchAssessmentDetails } from '../services/assessmentService.js';
import { findUserbyId } from '../services/adminService.js';
import { useNavigate } from 'react-router-dom';
import { AcademicCapIcon, UserCircleIcon, ClockIcon, UsersIcon } from '@heroicons/react/24/outline'; 

const StudentDashboard = () => {
    
  const { user, token, setSelectedAssessment } = useContext(AuthContext);
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
        if (Array.isArray(data)) {
          setallAssessments(data);
          await fetchCreatorNames(data);
        } else {
          setallAssessments([]); 
        }
      } catch (error) {
        console.error("Failed to fetch assessments", error);
        setallAssessments([]); 
      } finally {
        setLoading(false);
      }
    };

    if (token) getallAssessments();
  }, [token]);

  const fetchCreatorNames = async (assessments) => {
    const names = {};
    await Promise.all(
      assessments.map(async (assessment) => {
        if (!assessment.creator) return;
        const user = await findUserbyId(assessment.creator);
        if (user && user.name) {
          names[assessment.creator] = user.name;
        } else {
          names[assessment.creator] = "Unknown";
        }
      })
    );
    setCreatorNames(names);
  };

  const TakeAssessmentClickHandler = async (assessmentId) => {
    setLoading(true);
    try {
      const details = await fetchAssessmentDetails(assessmentId, token);
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
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Welcome, {user?.name}!</h1>
          <p className="text-slate-500 mt-1">Here are the assessments available for you.</p>
        </div>

        {/* Loading Spinner or Message */}
        {loading ? (
          <div className="text-center py-10">
            <p className="text-indigo-600">Loading Assessments...</p>
          </div>
        ) : allAssessments.length > 0 ? (
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allAssessments.map((assessment) => (
              
              <div
                key={assessment._id}
                className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 flex flex-col justify-between transition-transform transform hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                     <AcademicCapIcon className="w-8 h-8 text-indigo-500" />
                     <h3 className="text-xl font-bold text-slate-800">{assessment.title}</h3>
                  </div>
                  <p className="text-slate-500 text-sm mb-4">{assessment.description}</p>
                  
                  {/* Meta Information with Icons */}
                  <div className="space-y-2 text-sm text-slate-600 border-t pt-4">
                     <p className="flex items-center gap-2">
                        <UserCircleIcon className="w-5 h-5 text-slate-400" />
                        Created by: <span className="font-semibold text-indigo-600">{creatorNames[assessment.creator]}</span>
                     </p>
                     <p className="flex items-center gap-2">
                        <UsersIcon className="w-5 h-5 text-slate-400" />
                        Attempted by: <span className="font-semibold">{assessment.attempts.length} students</span>
                     </p>
                  </div>
                </div>

                {/* Action Button */}
                <button 
                  className="mt-6 w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition-all duration-300"
                  onClick={() => TakeAssessmentClickHandler(assessment?._id)}
                >
                  Take Assessment
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-slate-700">No Assessments Found</h2>
            <p className="text-slate-500 mt-2">Check back later for new assessments!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;