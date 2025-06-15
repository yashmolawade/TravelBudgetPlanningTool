import React, { useEffect } from "react";
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
import { selectCurrentView, setCurrentView, setActiveTab } from "./store/slices/uiSlice";

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const theme = useSelector((state) => state.ui.theme);
  const currentView = useSelector(selectCurrentView);
  const [initialAuthMode, setInitialAuthMode] = React.useState("login");

  // Initialize auth listener
  useAuth();

  // Determine initial view after loading
  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        // If authenticated, restore the last active tab if it exists
        const savedTab = localStorage.getItem('activeTab');
        if (savedTab) {
          dispatch(setActiveTab(savedTab));
        }
        dispatch(setCurrentView('dashboard'));
      } else if (currentView !== 'auth') {
        dispatch(setCurrentView('landing'));
      }
    }
  }, [loading, isAuthenticated, currentView, dispatch]);

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
  switch (currentView) {
    case "landing":
      content = (
        <LandingPage
          isAuthenticated={isAuthenticated}
          onSignInClick={() => {
            setInitialAuthMode("login");
            dispatch(setCurrentView("auth"));
          }}
          onSignUpClick={() => {
            setInitialAuthMode("signup");
            dispatch(setCurrentView("auth"));
          }}
          onDashboardClick={() => dispatch(setCurrentView("dashboard"))}
        />
      );
      break;
    case "auth":
      content = (
        <AuthContainer
          onAuthSuccess={() => dispatch(setCurrentView("dashboard"))}
          initialMode={initialAuthMode}
          onLogoClick={() => dispatch(setCurrentView("landing"))}
        />
      );
      break;
    case "dashboard":
      content = <AppContent onLogoClick={() => dispatch(setCurrentView("landing"))} />;
      break;
    default:
      content = (
        <LandingPage
          isAuthenticated={isAuthenticated}
          onSignInClick={() => {
            setInitialAuthMode("login");
            dispatch(setCurrentView("auth"));
          }}
          onSignUpClick={() => {
            setInitialAuthMode("signup");
            dispatch(setCurrentView("auth"));
          }}
          onDashboardClick={() => dispatch(setCurrentView("dashboard"))}
        />
      );
  }

  return <ErrorBoundary>{content}</ErrorBoundary>;
}

export default App;
