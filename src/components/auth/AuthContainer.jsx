import React, { useState } from 'react'
import Login from './Login'
import Signup from './Signup'

const AuthContainer = () => {
  const [isLoginMode, setIsLoginMode] = useState(true)

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode)
  }

  return (
    <>
      {isLoginMode ? (
        <Login onToggleMode={toggleMode} />
      ) : (
        <Signup onToggleMode={toggleMode} />
      )}
    </>
  )
}

export default AuthContainer