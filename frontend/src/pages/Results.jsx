import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { fetchStudentResults } from "../services/responseService";

const Results = () => {
  const { user } = useContext(AuthContext);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const loadResults = async () => {
      try {
        const data = await fetchStudentResults(user.token);
        setResults(data);
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };
    loadResults();
  }, [user.token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Your Results</h1>
      {results.length > 0 ? (
        <ul className="mt-4">
          {results.map((result) => (
            <li key={result._id} className="border p-4 rounded-lg mb-2">
              <p className="font-semibold">{result.assessmentId.title}</p>
              <p>Score: {result.score}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results available.</p>
      )}
    </div>
  );
};

export default Results;
