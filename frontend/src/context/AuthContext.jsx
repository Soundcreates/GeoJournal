import React, { useContext, createContext, useState, useEffect } from "react";
import { fetchStuff } from "../service/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetchStuff.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        const userData = {
          id: response.data.user._id || response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
          avatar: response.data.user.avatar,
          firstName: response.data.user.firstName,
          currentLocation: response.data.user.currentLocation || {
            city: "Unknown City",
            country: "Unknown Country",
          },
          countriesVisited:
            response.data.user.countriesVisited.length ||
            response.data.user.countriesVisited,
          entries: response.data.entries.length || response.data.entries,
          recentEntries:
            response.data.recentEntries.length || response.data.recentEntries,
          followers: response.data.user.followers.length || 0,
          following: response.data.user.following.length || 0,
        };
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.log(err.message);
      // Clear invalid token
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const value = {
    user,
    setUser,
    loading,
    setLoading,
    getUser,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
