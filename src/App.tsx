import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignupPage";
import HomePage from "./HomePage";
import Dashboard from "./Dashboard";
import PricingPlans from "./PricingPlans";
import AdminPanel from "./AdminPanel";
import MovieDetail from "./MovieDetails";
import { generateToken, messaging, onMessage } from "./notification/firebase";
import Success from "./Success";
import MovieFetcher from "./MovieFetcher";

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/pricing" element={<PricingPlans />} />
        <Route path="/success" element={<Success />} />
                <Route path="/fetcher" element={<MovieFetcher />} />

        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/movieDetails/:id" element={
          <ProtectedRoute>
            <MovieDetail />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;