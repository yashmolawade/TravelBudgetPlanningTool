import React from "react";
import { useSelector } from "react-redux";
import AppContent from "./components/AppContent";
import AuthContainer from "./components/auth/AuthContainer";
import { useAuth } from "./hooks/useAuth";
import {
  selectIsAuthenticated,
  selectAuthLoading,
} from "./store/slices/authSlice";

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);

  // Initialize auth listener
  useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <AppContent /> : <AuthContainer />;
}

export default App;
