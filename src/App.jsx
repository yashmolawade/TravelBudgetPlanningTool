import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import AppContent from "./components/AppContent";
import AuthContainer from "./components/auth/AuthContainer";
import ErrorBoundary from "./components/common/ErrorBoundary";
import LandingPage from "./components/LandingPage";
import { useAuth } from "./hooks/useAuth";
import {
  selectIsAuthenticated,
  selectAuthLoading,
} from "./store/slices/authSlice";
import { selectCurrentView, setCurrentView } from "./store/slices/uiSlice";

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const theme = useSelector((state) => state.ui.theme);
  const currentView = useSelector(selectCurrentView);
  const [initialAuthMode, setInitialAuthMode] = React.useState("login");

  // Initialize auth listener
  useAuth();

  // Handle view changes based on authentication status
  const handleViewChange = useCallback(() => {
    if (!loading) {
      if (isAuthenticated && currentView === "landing") {
        dispatch(setCurrentView("dashboard"));
      } else if (!isAuthenticated && currentView !== "auth") {
        dispatch(setCurrentView("landing"));
      }
    }
  }, [loading, isAuthenticated, currentView, dispatch]);

  // Effect to handle view changes
  useEffect(() => {
    handleViewChange();
  }, [handleViewChange]);

  // Apply dark mode class to root element
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleSignIn = useCallback(() => {
    setInitialAuthMode("login");
    dispatch(setCurrentView("auth"));
  }, [dispatch]);

  const handleSignUp = useCallback(() => {
    setInitialAuthMode("signup");
    dispatch(setCurrentView("auth"));
  }, [dispatch]);

  const handleDashboardClick = useCallback(() => {
    dispatch(setCurrentView("dashboard"));
  }, [dispatch]);

  const handleLogoClick = useCallback(() => {
    dispatch(setCurrentView("landing"));
  }, [dispatch]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case "landing":
        return (
          <LandingPage
            isAuthenticated={isAuthenticated}
            onSignInClick={handleSignIn}
            onSignUpClick={handleSignUp}
            onDashboardClick={handleDashboardClick}
          />
        );
      case "auth":
        return (
          <AuthContainer
            onAuthSuccess={handleDashboardClick}
            initialMode={initialAuthMode}
            onLogoClick={handleLogoClick}
          />
        );
      case "dashboard":
        return <AppContent onLogoClick={handleLogoClick} />;
      default:
        return (
          <LandingPage
            isAuthenticated={isAuthenticated}
            onSignInClick={handleSignIn}
            onSignUpClick={handleSignUp}
            onDashboardClick={handleDashboardClick}
          />
        );
    }
  };

  return <ErrorBoundary>{renderContent()}</ErrorBoundary>;
}

export default App;
