import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AppContent from "./components/AppContent";
import AuthContainer from "./components/auth/AuthContainer";
import ErrorBoundary from "./components/common/ErrorBoundary";
import LandingPage from "./components/LandingPage";
import { useAuth } from "./hooks/useAuth";
import {
  selectIsAuthenticated,
  selectAuthLoading,
} from "./store/slices/authSlice";

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const theme = useSelector((state) => state.ui.theme);
  const [view, setViewInternal] = useState("landing"); // 'landing', 'auth', 'dashboard'
  const [initialAuthMode, setInitialAuthMode] = useState("login");
  const [initialViewDetermined, setInitialViewDetermined] = useState(false); // New state to track if initial view has been set

  const setView = (newView, mode = "login") => {
    setInitialAuthMode(mode);
    setViewInternal(newView);
  };

  // Initialize auth listener
  useAuth();

  // Determine initial view after loading
  useEffect(() => {
    if (!loading && !initialViewDetermined) {
      if (isAuthenticated) {
        setViewInternal("dashboard");
      } else {
        setViewInternal("landing");
      }
      setInitialViewDetermined(true); // Mark that initial view has been set
    }
    // If not authenticated and currently in 'auth' view, do not redirect away from login/signup page.
    // This handles failed login attempts without forcing a redirect to landing.
    else if (
      !loading &&
      !isAuthenticated &&
      view !== "auth" &&
      initialViewDetermined
    ) {
      setViewInternal("landing");
    }
  }, [loading, isAuthenticated, view, initialViewDetermined]);

  // Apply dark mode class to root element
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

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

  let content;
  switch (view) {
    case "landing":
      content = (
        <LandingPage
          isAuthenticated={isAuthenticated}
          onSignInClick={() => setView("auth", "login")}
          onSignUpClick={() => setView("auth", "signup")}
          onDashboardClick={() => setView("dashboard")}
        />
      );
      break;
    case "auth":
      content = (
        <AuthContainer
          onAuthSuccess={() => setView("dashboard")}
          initialMode={initialAuthMode}
          onLogoClick={() => setView("landing")}
        />
      );
      break;
    case "dashboard":
      content = <AppContent onLogoClick={() => setView("landing")} />;
      break;
    default:
      content = (
        <LandingPage
          isAuthenticated={isAuthenticated}
          onSignInClick={() => setView("auth", "login")}
          onSignUpClick={() => setView("auth", "signup")}
          onDashboardClick={() => setView("dashboard")}
        />
      );
  }

  return <ErrorBoundary>{content}</ErrorBoundary>;
}

export default App;
