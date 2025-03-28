import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [selectedAssessment, setSelectedAssessment] = useState(
    () => JSON.parse(localStorage.getItem("selectedAssessment")) || null
  );
  

  useEffect(() => {
    if (selectedAssessment) {
      localStorage.setItem("selectedAssessment", JSON.stringify(selectedAssessment));
    } else {
      localStorage.removeItem("selectedAssessment"); // Clear localStorage if null
    }
  }, [selectedAssessment]);

  

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData?.token);
    setUser(userData);
    setToken(userData?.token);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken("");
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, token, setUser, setToken, login, logout, selectedAssessment, setSelectedAssessment }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
