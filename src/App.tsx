import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // Add this import
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import Dashboard from "./component/Dashboard";
import PricingPlans from "./component/PricingPlans";
import AdminPanel from "./component/AdminPanel";
import MovieDetail from "./component/MovieDetails";
import { generateToken, messaging, onMessage } from "./notification/firebase";
import Success from "./Success";
import {toast} from "react-hot-toast";
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
    let toastShown = false; // Define the variable

    generateToken();

    onMessage(messaging, (payload) => {
      if (toastShown) return; 

      toastShown = true;

      const title = payload.notification?.title || 'New Notification';
      const body = payload.notification?.body || 'You have a new message';
      toast.success(`${title}: ${body}`);

      setTimeout(() => {
        toastShown = false; 
      }, 3000);
    });
  }, []);

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            zIndex: 9999,
            fontSize: '16px',
            padding: '10px 20px',
            borderRadius: '8px',
          },
          error: {
            style: {
              background: '#ff4d4f',
              color: '#fff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/pricing" element={<PricingPlans />} />
        <Route path="/success" element={<Success />} />
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