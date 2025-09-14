
import { useState, useContext } from "react";
import { registerUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { UserPlusIcon } from '@heroicons/react/24/solid'; 

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student"); 
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await registerUser({ name, email, password, role });
            login(userData);
            
            const rolePaths = {
                creator: "/creator-dashboard",
                student: "/student-dashboard",
                admin: "/admin-dashboard",
            };
            navigate(rolePaths[role] || "/");
        } catch (error) {
            alert(error.response?.data?.message || "Registration failed");
        }
    };

    const roles = ['student', 'creator', 'admin'];

    return (
        
        <div className="flex items-center justify-center min-h-screen bg-slate-100 py-12 px-4">
            {/* Main card container with shadow and rounded corners */}
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
                <div className="text-center">
                    <UserPlusIcon className="mx-auto h-12 w-auto text-indigo-600" />
                    <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
                        Create your Account
                    </h2>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Enhanced Role Selector - styled as a segmented control */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">I am a...</label>
                        <div className="mt-2 grid grid-cols-3 gap-2 rounded-lg p-1 bg-slate-200">
                            {roles.map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-200 focus:ring-indigo-500 ${
                                        role === r
                                            ? 'bg-white text-indigo-700 shadow'
                                            : 'bg-transparent text-slate-600 hover:bg-white/50'
                                    }`}
                                    onClick={() => setRole(r)}
                                >
                                    {r.charAt(0).toUpperCase() + r.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Enhanced input fields with labels and better focus states */}
                    <div>
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
                        <input id="name" type="text" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>

                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</label>
                        <input id="email" type="email" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                        <input id="password" type="password" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>

                    {/* Enhanced submit button */}
                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform hover:scale-102"
                    >
                        Register
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600">
                    Already a User?{' '}
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 underline">
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;