import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateAssessment from "./pages/CreateAssessment";
import Navbar from "./components/Navbar";
import Results from "./pages/Results";
import Home from "./components/Home";
import CreatorDashboard from "./pages/CreatorDashboard.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Assessment_details from "./pages/Assessment_details.jsx";
import Assessment_page from "./pages/Assessment_page.jsx";

function App() {
  return (

    <Router>
      <Navbar />
      <Routes>
        <Route path="/results" element={<Results />} />
        <Route path="/creator-dashboard" element={<CreatorDashboard />} />
        <Route path="/assessment-details" element={<Assessment_details />} />
        <Route path="/assessment-page" element={<Assessment_page />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-assessment" element={<CreateAssessment />} />
      </Routes>
    </Router>
  );
}

export default App;
