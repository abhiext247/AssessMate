import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { createAssessment } from "../services/assessmentService.js";
import { useNavigate } from "react-router-dom";

const CreateAssessment = () => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const navigate = useNavigate();

  const handleAddQuestion = () => {
    if (!questionText || options.some(opt => !opt) || !correctAnswer) {
      alert("Please fill in all question fields before adding.");
      return;
    }

    const newQuestion = {
      questionText,
      options,
      correctAnswer,
    };

    setQuestions([...questions, newQuestion]);
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!title || !description || !timeLimit || questions.length === 0) {
  //     alert("Please fill all fields and add at least one question.");
  //     return;
  //   }

  //   try {
  //     await createAssessment({ title, description, timeLimit, questions }, user.token);
  //     navigate("/creatordashboard");
  //   } catch (error) {
  //     console.error("Error creating assessment:", error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !description || !timeLimit || questions.length === 0) {
      alert("Please fill all fields and add at least one question.");
      return;
    }
  
    if (!user || !user.token) {
      alert("Authorization error: No token found");
      return;
    }

    // console.log("User token:", user); // Debugging
  
    try {
      await createAssessment(
        { title, description, timeLimit, questions,creator:user._id,attempts:[] },
        user.token
      );
      navigate("/creator-dashboard");
    } catch (error) {
      console.error("Error creating assessment:", error.response?.data || error.message);
    }
  };
  

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Create Assessment</h1>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="border p-2 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          className="border p-2 w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Time Limit (in minutes)"
          className="border p-2 w-full"
          value={timeLimit}
          onChange={(e) => setTimeLimit(e.target.value)}
          required
        />

        {/* MCQ Input Section */}
        <div className="border p-4 rounded-md">
          <h2 className="text-lg font-semibold">Add MCQ Question</h2>
          <input
            type="text"
            placeholder="Question"
            className="border p-2 w-full mt-2"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
          {options.map((option, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Option ${String.fromCharCode(65 + index)}`}
              className="border p-2 w-full mt-2"
              value={option}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index] = e.target.value;
                setOptions(newOptions);
              }}
            />
          ))}
          <select
            className="border p-2 w-full mt-2"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
          >
            <option value="">Select Correct Answer</option>
            {options.map((opt, index) => (
              <option key={index} value={opt}>{`Option ${String.fromCharCode(65 + index)}`}</option>
            ))}
          </select>

          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded mt-3 hover:bg-blue-600 transition"
            onClick={handleAddQuestion}
          >
            Add Question
          </button>
        </div>

        {/* Display Added Questions */}
        {questions.length > 0 && (
          <div className="mt-4 border p-4 rounded-md">
            <h2 className="text-lg font-semibold">Added Questions</h2>
            {questions.map((q, index) => (
              <div key={index} className="p-2 border-b">
                <p className="font-medium">{`Q${index + 1}: ${q.questionText}`}</p>
                <ul className="ml-4">
                  {q.options.map((opt, i) => (
                    <li key={i}>{`${String.fromCharCode(65 + i)}: ${opt}`}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="text-red-500 mt-2"
                  onClick={() => handleRemoveQuestion(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
          Finish Assessment
        </button>
      </form>
    </div>
  );
};

export default CreateAssessment;
