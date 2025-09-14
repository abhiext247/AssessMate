
import { useState, useContext, useEffect } from "react";
import AuthContext from '../context/AuthContext';
import { sendStudentEmail } from "../services/assessmentService";
import { ChevronDownIcon, QuestionMarkCircleIcon, UserGroupIcon, EnvelopeIcon, CheckIcon } from '@heroicons/react/24/solid';

const AccordionSection = ({ title, icon, children, isOpen, onToggle }) => (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
        <button
            onClick={onToggle}
            className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
        >
            <div className="flex items-center gap-3">
                {icon}
                <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
            </div>
            <ChevronDownIcon className={`w-6 h-6 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
            <div className="p-4 bg-white">
                {children}
            </div>
        )}
    </div>
);

const AssessmentDetails = () => {
    const { selectedAssessment, setSelectedAssessment, user, token } = useContext(AuthContext);
    const [openSection, setOpenSection] = useState(null); 

    useEffect(() => {
        if (!selectedAssessment) {
            const stored = localStorage.getItem("selectedAssessment");
            if (stored) setSelectedAssessment(JSON.parse(stored));
        }
    }, [selectedAssessment, setSelectedAssessment]);

    const handleToggle = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    

    if (!selectedAssessment) {
        return <p className="text-center text-red-500 m-20 text-xl">Assessment details are not available.</p>;
    }

    return (
        <div className="bg-slate-50 min-h-screen py-10">
            <div className="max-w-4xl mx-auto p-4 sm:p-6">
                {/* Header Section */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-800">{selectedAssessment.title}</h1>
                    <p className="text-slate-600 mt-2">{selectedAssessment.description}</p>
                    {selectedAssessment.timeLimit && (
                        <p className="text-sm text-indigo-600 font-semibold mt-3">Time Limit: {selectedAssessment.timeLimit} minutes</p>
                    )}
                </div>

                {/* Accordion Sections */}
                <div className="space-y-4">
                    <AccordionSection
                        title="Assessment Questions"
                        icon={<QuestionMarkCircleIcon className="w-7 h-7 text-indigo-600" />}
                        isOpen={openSection === 'questions'}
                        onToggle={() => handleToggle('questions')}
                    >
                        {selectedAssessment.questions?.length > 0 ? (
                            <ul className="space-y-4">
                                {selectedAssessment.questions.map((q, index) => (
                                    <li key={q._id || index} className="p-4 border rounded-lg bg-slate-50">
                                        <p className="font-medium text-slate-900">{index + 1}. {q.questionText}</p>
                                        <ul className="mt-2 space-y-1 text-sm">
                                            {q.options.map((option, i) => (
                                                <li key={i} className={`flex items-center gap-2 p-2 rounded ${q.correctAnswer === option ? "bg-green-100 text-green-800 font-semibold" : "text-slate-700"}`}>
                                                    {q.correctAnswer === option && <CheckIcon className="w-5 h-5 text-green-600"/>}
                                                    {option}
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        ) : <p className="text-slate-500">No questions available.</p>}
                    </AccordionSection>

                    <AccordionSection
                        title={`Assessment Takers (${selectedAssessment.attempts?.length || 0})`}
                        icon={<UserGroupIcon className="w-7 h-7 text-indigo-600" />}
                        isOpen={openSection === 'takers'}
                        onToggle={() => handleToggle('takers')}
                    >
                        {selectedAssessment.attempts?.length > 0 ? (
                            <ul className="space-y-3">
                                {selectedAssessment.attempts.map((student) => (
                                    <li key={student.email} className="flex justify-between items-center p-3 border rounded-lg hover:bg-slate-50">
                                        <div>
                                            <p className="font-medium text-slate-800">{student.name}</p>
                                            <p className="text-sm text-slate-500">{student.email}</p>
                                            <p className="font-semibold text-indigo-700">Score: {student.score}/100</p>
                                        </div>
                                        {user?.role !== "student" && (
                                            <button className="inline-flex items-center gap-2 bg-green-500 text-white text-sm font-semibold px-3 py-2 rounded-lg shadow-sm hover:bg-green-600 transition">
                                                <EnvelopeIcon className="w-4 h-4" /> Send Email
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : <p className="text-slate-500">No one has taken this assessment yet.</p>}
                    </AccordionSection>
                </div>
            </div>
        </div>
    );
};

export default AssessmentDetails;