import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import Dashboard from "./component/Dashboard";
import PricingPlans from "./component/PricingPlans";
import AdminPanel from "./component/AdminPanel";
import MovieDetail from "./component/MovieDetails";
import { generateToken, messaging, onMessage } from "./notification/firebase";
import Success from "./component/Success";
import MovieFetcher from "./MovieFetcher";
import Profile from "./component/Profile";

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
        <Route path="/profile" element={<Profile/>} />
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