
import { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Bars3Icon, XMarkIcon, UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const baseLinkClass = "px-3 py-2 rounded-md text-sm font-medium transition-colors";
    const activeLinkClass = "bg-indigo-100 text-indigo-700";
    const inactiveLinkClass = "text-slate-700 hover:bg-slate-100 hover:text-slate-900";

    const roleLinks = {
        student: [
            { name: 'Dashboard', href: '/student-dashboard' },
            { name: 'My Results', href: '/results' },
        ],
        creator: [
            { name: 'Dashboard', href: '/creator-dashboard' },
            { name: 'Create', href: '/create-assessment' },
        ],
        admin: [
            { name: 'Dashboard', href: '/admin-dashboard' },
        ],
    };

    const getNavLinks = () => user ? (roleLinks[user.role] || []) : [];

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left side: Logo */}
                    <div className="flex-shrink-0 flex flex-row items-center">
                        <img src="./logo.png" alt="" className='w-14'/>
                        <Link to="/" className="text-2xl font-bold text-gray-500">
                            <span className='text-black'>Assess</span>Mate
                        </Link>
                    </div>

                    {/* Center: Navigation Links (Desktop) */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {getNavLinks().map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.href}
                                    className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}
                                >
                                    {item.name}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* Right side: Auth buttons or User info */}
                    <div className="hidden md:block">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-slate-600">
                                    Welcome, <span className="font-bold">{user.name}</span>
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="space-x-2">
                                <Link to="/login" className={`${baseLinkClass} ${inactiveLinkClass}`}>Login</Link>
                                <Link to="/register" className={`${baseLinkClass} bg-indigo-600 text-white hover:bg-indigo-700`}>Register</Link>
                            </div>
                        )}
                    </div>
                    
                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        >
                            {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-slate-200">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {getNavLinks().map((item) => (
                           <NavLink key={item.name} to={item.href} className={({ isActive }) => `block ${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                               {item.name}
                           </NavLink>
                        ))}
                    </div>
                    <div className="pt-4 pb-3 border-t border-slate-200">
                       {user ? (
                           <div className="px-5 flex flex-col items-start gap-3">
                               <div className="flex items-center gap-2">
                                   <UserCircleIcon className="h-8 w-8 text-slate-500"/>
                                   <div>
                                       <div className="text-base font-medium text-slate-800">{user.name}</div>
                                       <div className="text-sm font-medium text-slate-500">{user.email}</div>
                                   </div>
                               </div>
                               <button onClick={handleLogout} className="w-full text-left mt-2 block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-red-100 hover:text-red-700">
                                   Logout
                               </button>
                           </div>
                       ) : (
                           <div className="px-2 space-y-1">
                               <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100">Login</Link>
                               <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100">Register</Link>
                           </div>
                       )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;