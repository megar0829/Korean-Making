import React from 'react';
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  const [user, setUser] = useState(() =>
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loginUser = async (username, password) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.status === 201 || response.status === 200) {
        const data = await response.json();
        setUser(data.user.username);
        localStorage.setItem("user", JSON.stringify(data.user.username));
        localStorage.setItem("authTokens", JSON.stringify(data.jwt_token));
        localStorage.setItem("refresh", JSON.stringify(data.jwt_token.refresh_token))
        setAuthTokens(data.jwt_token);
        navigate("/main");
      } else {
        alert("Login failed. Please check your credentials.");
        navigate("/");
      }
    } catch (error) {
      console.error("An error occurred while logging in:", error);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const refresh = JSON.parse(localStorage.getItem("refresh"));

      if (!refresh) {
        logoutUser();
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/api/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: refresh,
        }),
      });

      if (response.status === 201 || response.status === 200) {
        const data = await response.json();
        localStorage.setItem("authTokens", JSON.stringify(data));
        setAuthTokens(data);
      } else {
        logoutUser();
      }
    } catch (error) {
      console.error("An error occurred while refreshing the access token:", error);
    }
  };

  const registerUser = async (username, email, password) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (response.status === 201 || response.status === 200) {
        navigate("/login");
      } else {
        alert("Registration failed. Please check the provided information.");
      }
    } catch (error) {
      console.error("An error occurred while registering:", error);
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/");
  };

  useEffect(() => {
    let logoutTimer;
    let refreshTimer;

    const resetTimer = () => {
      clearTimeout(logoutTimer);
      clearTimeout(refreshTimer);
      logoutTimer = setTimeout(logoutUser, 1000 * 60 * 15); 
      refreshTimer = setTimeout(refreshAccessToken, 1000 * 60 * 10); 
    };

    const activityEvents = ["mousemove", "keydown"];

    resetTimer();

    activityEvents.forEach((event) => {
      document.addEventListener(event, resetTimer);
    });

    return () => {
      activityEvents.forEach((event) => {
        document.removeEventListener(event, resetTimer);
      });
      clearTimeout(logoutTimer);
      clearTimeout(refreshTimer);
    };
  }, [refreshAccessToken]);

  useEffect(() => {
    if (!authTokens && window.location.pathname !== "/login" && window.location.pathname !== "/register") {
      navigate("/");
    }
    setLoading(false);
  }, [authTokens, navigate]);

  const contextData = {
    user: user,
    setUser: setUser,
    authTokens: authTokens,
    setAuthTokens: setAuthTokens,
    loginUser: loginUser,
    registerUser: registerUser,
    logoutUser: logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};


export const useAuth = () => React.useContext(AuthContext);
