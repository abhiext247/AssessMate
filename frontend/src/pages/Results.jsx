
import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { fetchStudentResults } from "../services/responseService";
import { TrophyIcon } from "@heroicons/react/24/solid";

const ScoreCircle = ({ score }) => {
    const getScoreColor = () => {
        if (score >= 80) return "text-green-500";
        if (score >= 50) return "text-yellow-500";
        return "text-red-500";
    };

    return (
        <div className={`text-4xl font-extrabold ${getScoreColor()}`}>
            {score}
            <span className="text-2xl text-slate-500">/100</span>
        </div>
    );
};

const Results = () => {
    const { user } = useContext(AuthContext);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadResults = async () => {
            if (!user?.token) return;
            try {
                setLoading(true);
                const data = await fetchStudentResults(user.token);
                setResults(data);
            } catch (error) {
                console.error("Error fetching results:", error);
            } finally {
                setLoading(false);
            }
        };
        loadResults();
    }, [user?.token]);

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="max-w-4xl mx-auto p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Your Results</h1>
                    <p className="text-slate-500 mt-1">Here's a summary of all the assessments you've completed.</p>
                </div>

                {loading ? (
                    <p className="text-center text-slate-600">Loading your results...</p>
                ) : results.length > 0 ? (
                    <div className="space-y-4">
                        {results.map((result) => (
                            <div key={result._id} className="bg-white rounded-xl shadow-lg border border-slate-200 p-5 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">{result.assessmentId.title}</h3>
                                    <p className="text-sm text-slate-500">Completed assessment</p>
                                </div>
                                <ScoreCircle score={result.score} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow-md border">
                        <TrophyIcon className="w-16 h-16 mx-auto text-slate-400" />
                        <h2 className="mt-4 text-xl font-semibold text-slate-700">No Results Found</h2>
                        <p className="text-slate-500 mt-2">Complete an assessment to see your results here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Results;