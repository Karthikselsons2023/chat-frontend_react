import React , {useEffect} from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import { Loader } from "lucide-react";
import { useAuthStore } from "./store/useAuthStore.js";
import { Toaster } from 'react-hot-toast';

export default function App() {
   const { authUser, checkAuth, isCheckingAuth, } = useAuthStore();
    useEffect(() => {
      checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth && !authUser) {
    return (
        <div className="flex items-center justify-center h-screen bg-surface-dark">
          <span className="loading loading-ring loading-xl text-main"></span>
        </div>
    );
  }
  return (
    <div className="h-screen bg-gray-50">
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
      />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />}  />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        
        
      </Routes>
    </div>
  );
}
