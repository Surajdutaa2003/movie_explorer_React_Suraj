import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignupPage";
import HomePage from "./HomePage";
import Dashboard from "./Dashboard";
import PricingPlans from "./PricingPlans";
import AdminPanel from "./AdminPanel";
import MovieDetail from "./MovieDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/pricing" element={<PricingPlans />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/movie/:id" element={<MovieDetail/>} />



      </Routes>
    </Router>
  );
}

export default App;
