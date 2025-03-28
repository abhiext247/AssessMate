import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const {user, token} = useContext(AuthContext)
  const handleClick = async ()=>{
    try {
      if(!user){
        navigate("/register");
      }else{
        const Role = user?.role;

        if(Role ==="creator"){
          navigate("/creator-dashboard");
        }else if(Role === "admin"){
          navigate("/admin-dashboard");
        }else{
          navigate("/student-dashboard");
        }
      }
    } catch (error) {
      
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to AssessMate</h1>
      <p className="text-lg text-gray-600 mb-6">
        The ultimate platform for creating and taking assessments effortlessly.
      </p>
      <button
        onClick={handleClick}
        className="px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-xl shadow-md hover:bg-blue-600 transition"
      >
        Get Started
      </button>
    </div>
  );
};

export default Home;
