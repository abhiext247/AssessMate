
import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { loginUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { LockClosedIcon } from '@heroicons/react/24/solid'; 

const Login = () => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await loginUser({ email, password });
      login(userData);
      if (userData) {
        const rolePaths = {
          creator: "/creator-dashboard",
          student: "/student-dashboard",
          admin: "/admin-dashboard",
        };
        navigate(rolePaths[userData.role]);
      } else {
        alert("Login Failed, You are not a registered user");
        navigate("/register");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };


  return (
    
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      {/* Main card container with shadow and rounded corners */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <LockClosedIcon className="mx-auto h-12 w-auto text-indigo-600" />
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Enhanced input fields with better focus states */}
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</label>
            <input
              id="email"
              type="email"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Enhanced submit button */}
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform hover:scale-102"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          New User?{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;