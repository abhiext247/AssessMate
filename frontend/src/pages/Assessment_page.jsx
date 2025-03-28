
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { submitResponse } from "../services/responseService";

const AssessmentPage = () => {
  const { selectedAssessment, token, } = useContext(AuthContext);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(selectedAssessment?.timeLimit * 60 || 0);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (started && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && started) {
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [started, timeLeft]);

  const handleStart = () => {
    setStarted(true);
    setAnswers(selectedAssessment.questions.map(q => ({ questionId: q._id, selectedOption: "" })));
  };

  const handleOptionChange = (questionId, option) => {
    setAnswers(prev => prev.map(ans => ans.questionId === questionId ? { ...ans, selectedOption: option } : ans));
  };

  const handleSubmit = async () => {
    if (submitted) return;

    const correctAnswers = selectedAssessment.questions.reduce((acc, q) => {
      const userAnswer = answers.find(ans => ans.questionId === q._id);
      return acc + (userAnswer?.selectedOption === q.correctAnswer ? 1 : 0);
    }, 0);

    const finalScore = ((correctAnswers / selectedAssessment.questions.length) * 100).toFixed(2);
    setScore(finalScore);
    setSubmitted(true);

    try {
      const assessmentId = selectedAssessment._id;
      await submitResponse(assessmentId, answers,finalScore, token);
    } catch (error) {
      console.error("Submission Error:", error);
    }
  };

  if (!selectedAssessment) return <p className="text-center text-gray-600">No assessment selected.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {!submitted ? (
        <>
          <h2 className="text-2xl font-bold mb-2">{selectedAssessment.title}</h2>
          <p className="text-gray-700">{selectedAssessment.description}</p>
          <p className="text-red-500 font-semibold">Time Limit: {selectedAssessment.timeLimit} min</p>

          {!started ? (
            <button
              onClick={handleStart}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              Start Assessment
            </button>
          ) : (
            <div>
              <p className="text-red-600 font-bold text-lg">
                Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}
              </p>

              {selectedAssessment.questions.map((q, index) => (
                <div key={q._id} className="border-b py-4">
                  <p className="font-semibold">{index + 1}. {q.questionText}</p>
                  <div className="mt-2 space-y-2">
                    {q.options.map((option, idx) => (
                      <label
                        key={idx}
                        className={`flex items-center space-x-2 cursor-pointer px-4 py-2 rounded-md transition ${
                          answers.find(ans => ans.questionId === q._id)?.selectedOption === option
                            ? "bg-blue-100 border border-blue-500"
                            : "bg-gray-100 border border-gray-300 hover:bg-gray-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${q._id}`}
                          value={option}
                          checked={answers.find(ans => ans.questionId === q._id)?.selectedOption === option}
                          onChange={() => handleOptionChange(q._id, option)}
                          className="hidden"
                        />
                        <div
                          className={`w-5 h-5 flex justify-center items-center rounded-full border-2 ${
                            answers.find(ans => ans.questionId === q._id)?.selectedOption === option
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-400 bg-white"
                          }`}
                        >
                          {answers.find(ans => ans.questionId === q._id)?.selectedOption === option && (
                            <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="text-gray-800">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={handleSubmit}
                className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
              >
                Submit Assessment
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center bg-green-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-green-700">🎉 Congratulations! 🎉</h2>
          <p className="text-lg text-gray-700 mt-2">You have successfully submitted your assessment.</p>
          <div className="mt-4 bg-white p-4 rounded shadow">
            <p className="text-lg font-semibold text-gray-800">📌 {selectedAssessment.title}</p>
            <p className="text-gray-600">⏳ Time Limit: {selectedAssessment.timeLimit} min</p>
            <p className="text-lg font-bold text-blue-600 mt-2">💯 Your Score: {score}/100</p>
          </div>
          <button
            onClick={() => navigate("/student-dashboard")}
            className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Back to Assessments
          </button>
        </div>
      )}
    </div>
  );
};

export default AssessmentPage;
