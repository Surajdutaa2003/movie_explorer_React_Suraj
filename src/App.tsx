// import React, { useEffect } from "react";
// import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
// import LoginPage from "./pages/LoginPage";
// import SignUpPage from "./pages/SignupPage";
// import HomePage from "./pages/HomePage";
// import Dashboard from "./component/Dashboard";
// import PricingPlans from "./component/PricingPlans";
// import AdminPanel from "./component/AdminPanel";
// import MovieDetail from "./component/MovieDetails";
// import { generateToken, messaging, onMessage } from "./notification/firebase";
// import Success from "./component/Success";
// import MovieFetcher from "./MovieFetcher";
// import Profile from "./component/Profile";

// // Protected Route component
// const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const token = localStorage.getItem('token');
  
//   if (!token) {
//     return <Navigate to="/" replace />;
//   }

//   return <>{children}</>;
// };

// function App() {
//   useEffect(() => {
//     generateToken();
//     onMessage(messaging, (payload) => {
//       console.log("Foreground message received:", payload);
//     });
//   }, []);

//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<SignUpPage />} />
//         <Route path="/home" element={<HomePage />} />
//         <Route path="/" element={<Dashboard />} />
//         <Route path="/pricing" element={<PricingPlans />} />
//         <Route path="/profile" element={<Profile/>} />
//         <Route path="/success" element={<Success />} />
//                 <Route path="/fetcher" element={<MovieFetcher />} />

//         <Route path="/admin" element={<AdminPanel />} />
//         <Route path="/movieDetails/:id" element={
//           <ProtectedRoute>
//             <MovieDetail />
//           </ProtectedRoute>
//         } />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
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
import Goodbye from "./component/Goodbye";

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
      const title = payload.notification?.title || 'New Notification';
      const body = payload.notification?.body || 'You have a new message';
      toast.success(`${title}: ${body}`, { duration: 10000 });
      console.log("Foreground message received:", payload);
    });
  }, []);

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 10000, // 10 seconds
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
        <Route path="/profile" element={<Profile />} />
        <Route path="/success" element={<Success />} />
        <Route path="/fetcher" element={<MovieFetcher />} />
        <Route path="/admin" element={<AdminPanel />} />
      <Route path="/goodbye" element={<Goodbye />} />

        <Route
          path="/movieDetails/:id"
          element={
            <ProtectedRoute>
              <MovieDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;