import { useState, useContext, useEffect } from "react";
import AuthContext from '../context/AuthContext'
import { sendStudentEmail } from "../services/assessmentService";
import { useNavigate } from "react-router-dom";


const AssessmentDetails = () => {
  const { selectedAssessment, setSelectedAssessment, user,token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showQuestions, setShowQuestions] = useState(false);
  const [showTakers, setShowTakers] = useState(false);

  useEffect(() => {
    if (!selectedAssessment) {
      const storedAssessment = JSON.parse(localStorage.getItem("selectedAssessment"));
      if (storedAssessment) {
        setSelectedAssessment(storedAssessment);
      }
    }
  }, [selectedAssessment, setSelectedAssessment]);

  if (!selectedAssessment) {
    return <p className="text-center text-red-500 m-20">Assessment Details are not Available...</p>;
  }

  //studentEmail, studentName, assessmentName, description, score, token
  const handleSendEmail = async (student) => {
    const studentEmail = student.email;
    const studentName = student.name;
    const assessmentName = selectedAssessment.name;
    const description = selectedAssessment.description;
    const score = student.score;
    try {
      await sendStudentEmail(
        studentEmail,
        studentName,
        assessmentName,
        description,
        score,
        token
      );
      alert(`Email sent to ${student.name}`);
    } catch (error) {
      console.error("Error sending email", error);
    }
  };

  const questionClickhandler = ()=>{
    if(showTakers){
      setShowTakers(!showTakers)
    }
    setShowQuestions(!showQuestions)
  }
  const takersClickhandler = ()=>{
    if(showQuestions){
      setShowQuestions(!showQuestions)
    }
    setShowTakers(!showTakers)
  }

  return (
    <div className="max-w-2xl sm:max-w-4xl mx-auto p-6 bg-blue-100 shadow-lg rounded-lg mt-10">
      {/* Assessment Details */}
      <h1 className="text-3xl font-bold text-black">{selectedAssessment.title}</h1>
      <p className="text-gray-700 mt-2">{selectedAssessment.description}</p>
      {selectedAssessment.timeLimit && (
        <p className="text-sm text-black mt-1">Time Limit: {selectedAssessment.timeLimit} mins</p>
      )}

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={questionClickhandler}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all"
        >
          {showQuestions ? "Hide Assessment Questions" : "Show Assessment Questions"}
        </button>
        <button
          onClick={takersClickhandler}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-all"
        >
          {showTakers ? "Hide Assessment Takers" : "Show Assessment Takers"}
        </button>
      </div>

      {/* Questions Section */}
      {showQuestions && (
        <div className="mt-6 border-t border-black pt-4">
          <h2 className="text-xl font-semibold">Assessment Questions</h2>
          {selectedAssessment.questions.length > 0 ? (
            <ul className="mt-2">
              {selectedAssessment.questions.map((q, index) => (
                <li key={index} className="mt-4 p-4 border rounded-lg">
                  <p className="font-medium">{index + 1}. {q.questionText}</p>
                  <ul className="mt-2">
                    {["A", "B", "C", "D"].map((opt, i) => (
                      <li
                        key={i}
                        className={`p-2 rounded text-black ${q.correctAnswer === q.options[i] ? "bg-green-200" : "bg-white"}`}
                      >
                        {opt}: {q.options[i]}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No questions available for this assessment.</p>
          )}
        </div>
      )}

      {/* Assessment Takers Section */}
      {showTakers && (
        <div className="mt-6 border-t py-4 bg-white">
          <h2 className="text-xl font-semibold px-4">Assessment Takers</h2>
          {selectedAssessment.attempts.length > 0 ? (
            <ul className="mt-2">
              {selectedAssessment.attempts.map((student) => (
                <li key={student.email} className="flex justify-between items-center p-2 border rounded m-2 px-4">
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-gray-500">{student.email}</p>
                    <p className="font-semibold">Score: {student.score}</p>
                  </div>
                  {user?.role === "creator" && (
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-all"
                      onClick={() => handleSendEmail(student)}
                    >
                      Send Email
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No one has taken this assessment yet.</p>
          )}
        </div>
      )}
    </div>

  );
};

export default AssessmentDetails;
