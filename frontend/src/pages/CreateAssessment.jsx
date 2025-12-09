import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { createAssessment } from "../services/assessmentService.js";
import { useNavigate } from "react-router-dom";
import { PlusIcon, TrashIcon, BookOpenIcon, ClockIcon } from '@heroicons/react/24/solid';

const CreateAssessment = () => {
  
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [questions, setQuestions] = useState([]);
  
  // State for the current question being added
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  
  const navigate = useNavigate();
  
  
  const handleAddQuestion = () => { 
    // Validation: Ensure all fields are filled
    if (!questionText.trim() || options.some(opt => !opt.trim()) || !correctAnswer) {
      alert("Please fill in the question, all 4 options, and select a correct answer.");
      return;
    }

    const newQuestion = {
      questionText,
      options,
      correctAnswer
    };

    setQuestions([...questions, newQuestion]);

    // Reset fields for next question
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");
  };

  
  const handleRemoveQuestion = (index) => { 
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  
  const handleSubmit = async (e) => { 
    e.preventDefault();

    if (!title || !description || !timeLimit || questions.length === 0) {
      alert("Please fill in all assessment details and add at least one question.");
      return;
    }

    const assessmentData = {
      title,
      description,
      timeLimit: Number(timeLimit),
      questions,
      creator: user._id // Assuming user object has _id
    };

    try {
      // Assuming createAssessment takes (data, token)
      await createAssessment(assessmentData, user.token); 
      alert("Assessment created successfully!");
      navigate('/creator-dashboard'); // Redirect after success
    } catch (error) {
      console.error("Error creating assessment:", error);
      alert("Failed to create assessment.");
    }
  };
  
  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-6 px-4">Create a New Assessment</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Assessment Details */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-700 mb-4 flex items-center gap-2"><BookOpenIcon className="w-6 h-6"/>Details</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Assessment Title" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <textarea placeholder="Description" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500" value={description} onChange={(e) => setDescription(e.target.value)} required />
              <div className="relative">
                <ClockIcon className="w-5 h-5 absolute left-3 top-3.5 text-slate-400"/>
                <input type="number" placeholder="Time Limit (in minutes)" className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-indigo-500" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} required />
              </div>
            </div>
          </div>

          {/* Section 2: Add Questions */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-700 mb-4">Add Questions</h2>
            <div className="space-y-3">
              <input type="text" placeholder="Question Text" className="w-full p-3 border rounded-lg" value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
              
              {/* Option Inputs */}
              {options.map((option, index) => ( 
                <input 
                  key={index} 
                  type="text" 
                  placeholder={`Option ${index + 1}`} 
                  className="w-full p-3 border rounded-lg" 
                  value={option} 
                  onChange={(e) => { 
                    const newOptions = [...options]; 
                    newOptions[index] = e.target.value; 
                    setOptions(newOptions); 
                  }} 
                /> 
              ))}

              <select className="w-full p-3 border rounded-lg bg-white" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} >
                <option value="">Select the Correct Answer</option>
                {options.map((opt, index) => ( opt && <option key={index} value={opt}>{opt}</option> ))}
              </select>
            </div>
            
            <button type="button" onClick={handleAddQuestion} className="mt-4 inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700">
              <PlusIcon className="w-5 h-5"/> Add Question
            </button>
          </div>
          
          {/* Section 3: Added Questions List */}
          {questions.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <h2 className="text-2xl font-semibold text-slate-700 mb-4">Added Questions ({questions.length})</h2>
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-slate-50 flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{index + 1}. {q.questionText}</p>
                      <ul className="list-disc list-inside mt-2 text-sm text-slate-600">
                        {q.options.map((opt, i) => ( <li key={i} className={q.correctAnswer === opt ? 'font-bold text-green-600' : ''}>{opt}</li> ))}
                      </ul>
                    </div>
                    <button type="button" onClick={() => handleRemoveQuestion(index)} className="text-red-500 hover:text-red-700 p-1">
                      <TrashIcon className="w-5 h-5"/>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Finish Button */}
          <button type="submit" className="w-full bg-green-600 text-white font-bold text-lg py-3 px-6 rounded-lg shadow-xl hover:bg-green-700 transition-all transform hover:scale-101">
            Finish & Create Assessment
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAssessment;