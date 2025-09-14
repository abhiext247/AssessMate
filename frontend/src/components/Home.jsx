
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { ArrowRightIcon } from '@heroicons/react/24/solid'; 

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); 

  const handleClick = () => {
    if (!user) {
      navigate("/register");
    } else {
      
      const rolePaths = {
        creator: "/creator-dashboard",
        admin: "/admin-dashboard",
        student: "/student-dashboard",
      };
      navigate(rolePaths[user.role] || "/");
    }
  };

  return (
    
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-100 text-center px-4">
      <div className="max-w-3xl">
        {/* Added a small badge for branding */}
        <span className="inline-block px-4 py-1 mb-4 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-full">
          Welcome to the Future of Assessments
        </span>

        {/* Enhanced typography: larger, bolder, with a subtle gradient text effect */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500 mb-6">
          AssessMate
        </h1>

        {/* Softer, more readable paragraph text */}
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          The ultimate platform for creating and taking assessments effortlessly. Streamline learning, track progress, and achieve more.
        </p>

        {/* Enhanced button with an icon, better hover effects, and a modern color */}
        <button
          onClick={handleClick}
          className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
          Get Started
          <ArrowRightIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Home;