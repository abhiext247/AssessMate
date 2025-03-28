import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await loginUser({ email, password });
      // console.log('this is my token for handle SUbmoit function', token);
      login(userData);
      console.log("this is the user data",userData)
      if(userData){
        if (userData.role === "creator") {
          navigate("/creator-dashboard")
        } else if (userData.role === "student") {
          navigate("/student-dashboard");
        } else {
          navigate("/admin-dashboard");
        }
      }else{
        alert("Login Failed, You are not a registered user")
        navigate("/register")
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-50">
      <form className="bg-white shadow-md p-6 rounded-lg flex flex-col w-[50vw]" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">LogIn</h2>
        <input type="email" className="border p-2 mb-2 w-full" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" className="border p-2 mb-4 w-full" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>

        <div className="pt-2">
          <p>New User? <Link to="/register" className="text-blue-500 underline font-medium">Register</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Login;
