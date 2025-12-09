import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { submitResponse } from "../services/responseService";
import { ClockIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

const AssessmentPage = () => {
  const { selectedAssessment, token } = useContext(AuthContext);
  const navigate = useNavigate();

  
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  
  useEffect(() => {
    if (selectedAssessment) {
      setTimeLeft(selectedAssessment.timeLimit * 60);
    }
  }, [selectedAssessment]);

  
  useEffect(() => {
    let timer;
    if (started && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && started && !submitted) {
      handleSubmit(); // Auto-submit when time runs out
    }
    return () => clearInterval(timer);
  }, [started, timeLeft, submitted]);

  
  const handleStart = () => {
    setStarted(true);
    // Initialize answers array with empty strings
    setAnswers(selectedAssessment.questions.map(q => ({ questionId: q._id, selectedOption: "" })));
  };

  
  const handleOptionChange = (questionId, option) => {
    setAnswers(prev => prev.map(ans => 
      ans.questionId === questionId ? { ...ans, selectedOption: option } : ans
    ));
  };

  const handleSubmit = async () => {
    if (submitted) return;

    // Calculate Score locally for immediate display
    const correctAnswers = selectedAssessment.questions.reduce((acc, q) => {
      const userAnswer = answers.find(ans => ans.questionId === q._id);
      return acc + (userAnswer?.selectedOption === q.correctAnswer ? 1 : 0);
    }, 0);

    const finalScore = ((correctAnswers / selectedAssessment.questions.length) * 100).toFixed(2);
    setScore(finalScore);
    setSubmitted(true);

    try {
      // Send data to backend
      await submitResponse(selectedAssessment._id, answers, finalScore, token);
    } catch (error) {
      console.error("Submission Error:", error);
    }
  };

  // Helper for time formatting
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Early return if no assessment (Must be AFTER hooks)
  if (!selectedAssessment) return (
     <div className="text-center py-20">
        <p className="text-xl text-slate-600">No assessment selected.</p>
        <button onClick={() => navigate('/student-dashboard')} className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-lg">Back to Dashboard</button>
     </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200">
        {!submitted ? (
          <div className="p-6 md:p-8">
            {/* Assessment Header */}
            <div className="border-b pb-4 mb-6">
              <h2 className="text-3xl font-bold text-slate-800">{selectedAssessment.title}</h2>
              <p className="text-slate-500 mt-1">{selectedAssessment.description}</p>
            </div>

            {!started ? (
              <div className="text-center py-10">
                <p className="text-lg font-semibold text-red-600 flex items-center justify-center gap-2 mb-6">
                    <ClockIcon className="w-6 h-6"/> Time Limit: {selectedAssessment.timeLimit} minutes
                </p>
                <button
                  onClick={handleStart}
                  className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-indigo-700 transition-transform hover:scale-105"
                >
                  Start Assessment
                </button>
              </div>
            ) : (
              <div>
                {/* Sticky Timer */}
                <div className="sticky top-0 bg-white/80 backdrop-blur-sm py-3 mb-6 border-b z-10">
                    <p className="text-center text-2xl font-bold text-red-600 animate-pulse">
                      Time Left: {formatTime(timeLeft)}
                    </p>
                </div>
                
                {/* Questions */}
                <div className="space-y-8">
                  {selectedAssessment.questions.map((q, index) => (
                    <div key={q._id} className="bg-slate-50 p-6 rounded-lg border">
                      <p className="font-semibold text-lg text-slate-800">{index + 1}. {q.questionText}</p>
                      <div className="mt-4 space-y-3">
                        {q.options.map((option, idx) => (
                          <label key={idx} className={`flex items-center gap-3 cursor-pointer p-4 rounded-lg border-2 transition-all ${
                              answers.find(a => a.questionId === q._id)?.selectedOption === option
                                ? 'bg-indigo-100 border-indigo-500 shadow-inner'
                                : 'bg-white border-slate-300 hover:border-indigo-400'
                          }`}>
                            <input 
                                type="radio" 
                                name={`question-${q._id}`} 
                                value={option} 
                                onChange={() => handleOptionChange(q._id, option)} 
                                className="hidden" 
                            />
                            <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                answers.find(a => a.questionId === q._id)?.selectedOption === option ? 'border-indigo-600 bg-indigo-600' : 'border-slate-400'
                            }`}>
                               {answers.find(a => a.questionId === q._id)?.selectedOption === option && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </span>
                            <span className="text-slate-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSubmit}
                  className="mt-8 w-full bg-green-600 text-white font-bold py-3 rounded-lg shadow-xl hover:bg-green-700 transition"
                >
                  Submit Assessment
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-10">
            <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto animate-pulse" />
            <h2 className="text-3xl font-bold text-slate-800 mt-4">Submission Successful!</h2>
            <p className="text-slate-500 mt-2">Your results have been recorded.</p>
            <div className="mt-8 bg-slate-100 p-6 rounded-lg inline-block">
              <p className="text-xl font-semibold text-slate-700">{selectedAssessment.title}</p>
              <p className="text-4xl font-extrabold text-indigo-600 mt-2">{score}<span className="text-2xl text-slate-500">/100</span></p>
            </div>
            <br />
            <button
              onClick={() => navigate("/student-dashboard")}
              className="mt-8 bg-indigo-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentPage;