import { useState, useContext } from "react";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const { login, token } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await registerUser({ name, email, password, role });
            // console.log("This is user data after register", userData);
            login(userData);
            if (userData.role === "creator") {
                navigate("/creator-dashboard")
            } else if (userData.role === "student") {
                navigate("/student-dashboard");
            } else {
                navigate("/admin-dashboard");
            }
        } catch (error) {
            alert(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-blue-50">
            <form className="bg-white shadow-md p-6 rounded-lg" onSubmit={handleSubmit}>
                <h2 className="text-xl font-bold mb-4">Register</h2>

                {/* Role Selection Buttons */}
                <div className="flex justify-between mb-4">
                    {['student', 'creator', 'admin'].map((r) => (
                        <button
                            key={r}
                            type="button"
                            className={`px-4 py-2 rounded border transition-colors duration-200 w-1/3 mx-1 
                                ${role === r ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
                            onClick={() => setRole(r)}
                        >
                            {r.charAt(0).toUpperCase() + r.slice(1)}
                        </button>
                    ))}
                </div>

                <input type="text" className="border p-2 mb-2 w-full" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="email" className="border p-2 mb-2 w-full" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" className="border p-2 mb-2 w-full" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full">Register</button>
                <div className="pt-2">
                    <p>Already a User? <Link to="/login" className="text-blue-500 underline font-medium">LogIn</Link></p>
                </div>
            </form>
        </div>
    )
};

export default Register;