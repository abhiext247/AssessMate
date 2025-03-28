import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import AuthContext from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  

  const handleLogout = ()=>{
    return logout() && navigate("/")
  }

  return (
    <div>
      <nav className="flex flex-row justify-between bg-blue-100 w-full h-10 items-center px-8 py-8">
        
        <h1 className='text-2xl font-semibold text-blue-500 cursor-pointer' onClick={() => navigate('/')}>AssessMate</h1>

        <div className='flex flex-row gap-2 sm:gap-3'>
          {user ? (
            <div className='flex items-center gap-2 sm:gap-3'>
              <p className='text-grey-600 max-sm:hidden pl-4'>Hi, {user.name}</p>
              <div className='relative group'>
                        <img src={assets.profile_icon} alt="" className='w-10 drop-shadow'/>
                        <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12">
                            <ul className='list-none m-0 p-2 bg-white rounded-md border text-md'>
                                <li onClick={handleLogout} className='py-0.5 px-2 cursor-pointer '>Logout</li>
                            </ul>
                        </div>
                    </div>
            </div>
          ) : (
            <>
              <button 
                className='bg-blue-500 text-white px-4 py-1 rounded-full font-bold hover:bg-blue-600 hover:scale-105 transition' 
                onClick={() => navigate('/register')} 
              >
                SignUp
              </button>
              <button 
                className='bg-white text-blue-500 border-2 px-4 py-1 rounded-full font-bold hover:scale-105 transition' 
                onClick={() => navigate('/login')}
              >
                LogIn
              </button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
