import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignupPage";
import HomePage from "./HomePage";
import Dashboard from "./Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<Dashboard />} />


      </Routes>
    </Router>
  );
}

export default App;
