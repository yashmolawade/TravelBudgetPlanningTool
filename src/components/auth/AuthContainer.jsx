import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

const AuthContainer = ({ onAuthSuccess, initialMode, onLogoClick }) => {
  const [isLoginMode, setIsLoginMode] = useState(initialMode === "login");

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  return (
    <>
      {isLoginMode ? (
        <Login
          onToggleMode={toggleMode}
          onAuthSuccess={onAuthSuccess}
          onLogoClick={onLogoClick}
        />
      ) : (
        <Signup
          onToggleMode={toggleMode}
          onAuthSuccess={onAuthSuccess}
          onLogoClick={onLogoClick}
        />
      )}
    </>
  );
};

export default AuthContainer;
