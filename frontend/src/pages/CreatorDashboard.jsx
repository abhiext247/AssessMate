
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from '../context/AuthContext';
import { fetchCreatorAssessments, fetchAssessmentDetails } from "../services/assessmentService";
import { PlusIcon, AcademicCapIcon, UsersIcon } from "@heroicons/react/24/solid";

const CreatorDashboard = () => {
    const { user, token, setSelectedAssessment } = useContext(AuthContext);
    const navigate = useNavigate();
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getAssessments = async () => {
            if (!token || !user?._id) return;
            try {
                setLoading(true);
                const data = await fetchCreatorAssessments(token, user._id);
                setAssessments(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch assessments", error);
                setAssessments([]);
            } finally {
                setLoading(false);
            }
        };
        getAssessments();
    }, [token, user?._id]);

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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Welcome, {user?.name}!</h1>
                        <p className="text-slate-500 mt-1">Manage your assessments from here.</p>
                    </div>
                    <button
                        className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-5 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-all transform hover:scale-105"
                        onClick={() => navigate("/create-assessment")}
                    >
                        <PlusIcon className="w-5 h-5" />
                        Create New Assessment
                    </button>
                </div>

                {/* Assessments Grid */}
                {loading ? (
                    <p className="text-center text-slate-600">Loading your assessments...</p>
                ) : assessments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {assessments.map((assessment) => (
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
                                <div className="border-t pt-4 mt-4">
                                    <p className="flex items-center gap-2 text-sm text-slate-600">
                                        <UsersIcon className="w-5 h-5 text-slate-400" />
                                        Attempted by: <span className="font-semibold">{assessment.attempts.length} students</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow-md border">
                        <h2 className="text-xl font-semibold text-slate-700">No Assessments Yet</h2>
                        <p className="text-slate-500 mt-2">Click 'Create New Assessment' to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreatorDashboard;