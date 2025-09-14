
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { fetchAssessments, fetchAssessmentDetails } from '../services/assessmentService.js';
import { findUserbyId } from '../services/adminService.js';
import { AcademicCapIcon, UsersIcon, UserCircleIcon } from '@heroicons/react/24/solid';

const AdminDashboard = () => {
    const { user, token, setSelectedAssessment } = useContext(AuthContext);
    const navigate = useNavigate();
    const [allAssessments, setAllAssessments] = useState([]);
    const [creatorNames, setCreatorNames] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            console.error("No token available.");
            setLoading(false);
            return;
        }

        const getAssessmentsAndCreators = async () => {
            try {
                setLoading(true);
                const data = await fetchAssessments(token);
                if (Array.isArray(data)) {
                    setAllAssessments(data);
                    
                    
                    const names = {};
                    await Promise.all(
                        data.map(async (assessment) => {
                            if (!assessment.creator || names[assessment.creator]) return;
                            try {
                                const creator = await findUserbyId(assessment.creator);
                                names[assessment.creator] = creator?.name || "Unknown";
                            } catch {
                                names[assessment.creator] = "Unknown";
                            }
                        })
                    );
                    setCreatorNames(names);
                } else {
                    setAllAssessments([]);
                }
            } catch (error) {
                console.error("Failed to fetch assessments", error);
                setAllAssessments([]);
            } finally {
                setLoading(false);
            }
        };

        getAssessmentsAndCreators();
    }, [token]);

    const handleAssessmentClick = async (assessmentId) => {
        try {
            const details = await fetchAssessmentDetails(assessmentId, token);
            setSelectedAssessment(details);
            localStorage.setItem("selectedAssessment", JSON.stringify(details));
            navigate("/assessment-details");
        } catch (error) {
            console.error("Error fetching assessment details", error);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto p-6">
                {/* Dashboard Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Administrator Dashboard</h1>
                    <p className="text-slate-500 mt-1">Overview of all assessments in the system.</p>
                </div>

                {/* Assessments Grid */}
                {loading ? (
                    <p className="text-center text-slate-600">Loading all assessments...</p>
                ) : allAssessments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allAssessments.map((assessment) => (
                            <div
                                key={assessment._id}
                                className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 flex flex-col justify-between transition-all transform hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                                onClick={() => handleAssessmentClick(assessment._id)}
                            >
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <AcademicCapIcon className="w-8 h-8 text-indigo-500" />
                                        <h3 className="text-xl font-bold text-slate-800">{assessment.title}</h3>
                                    </div>
                                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">{assessment.description}</p>
                                </div>
                                <div className="space-y-2 text-sm text-slate-600 border-t pt-4 mt-4">
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
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow-md border">
                        <h2 className="text-xl font-semibold text-slate-700">No Assessments Found</h2>
                        <p className="text-slate-500 mt-2">There are no assessments in the system yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;