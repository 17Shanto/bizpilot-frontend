import React, { createContext, useContext, useState, useEffect } from "react";
import {
  loginUser as apiLoginUser,
  logoutUser as apiLogoutUser,
  getStoredUser,
  getStoredToken,
  storeAuthData,
  isAuthenticated as checkIsAuthenticated,
} from "@/services/authService";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = getStoredUser();
        const storedToken = getStoredToken();

        if (storedUser && storedToken) {
          setUser(storedUser);
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Clear invalid data
        apiLogoutUser();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await apiLoginUser(email, password);

      // Extract user and token from the specific API response structure
      const userData = response.data?.user;
      const authToken = response.data?.accessToken;

      if (!authToken) {
        throw new Error("No authentication token received");
      }

      if (!userData) {
        throw new Error("No user data received");
      }

      // Store in localStorage
      storeAuthData(userData, authToken);

      // Update state
      setUser(userData);
      setToken(authToken);

      return { user: userData, token: authToken };
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    try {
      // Clear localStorage
      apiLogoutUser();

      // Clear state
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return checkIsAuthenticated() && user && token;
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return "";

    // Handle the API response structure: firstName + lastName
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }

    return (
      user.displayName ||
      user.name ||
      user.firstName ||
      user.email?.split("@")[0] ||
      "User"
    );
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "";

    const displayName = getUserDisplayName();
    const nameParts = displayName.split(" ");

    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }

    return displayName.substring(0, 2).toUpperCase();
  };

  // Get user avatar URL
  const getUserAvatar = () => {
    return user?.photo || user?.avatar || user?.profilePicture || null;
  };

  // Get user account status
  const getUserAccountStatus = () => {
    return user?.account || "Free";
  };

  // Update user data (for account upgrades)
  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };
    setUser(newUserData);
    storeAuthData(newUserData, token);
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated,
    getUserDisplayName,
    getUserInitials,
    getUserAvatar,
    getUserAccountStatus,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
