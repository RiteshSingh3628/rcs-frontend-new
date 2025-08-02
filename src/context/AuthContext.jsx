import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI, userAPI } from '../api/api';
import { useApp } from './AppContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // const {userProfile} = useApp();

  // Auto-login if token is found
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    // console.log("we are here ")
    if (token) {
      // setUser({ token });
      userProfile()
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [isAuthenticated]);

  

  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(credentials);
      // console.log("login response",response.data);
      const { access, refresh } = response.data;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // setUser({ token: access, ...credentials });
      setIsAuthenticated(true);
      setIsLoading(false);

      // getting user data
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Login failed';
      setError(errorMessage);
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const signup = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      await authAPI.signup(userData);
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Signup failed';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  };


  const userProfile = async()=>{

    const res = await userAPI.getProfile();
    // console.log(res.data);
    setUser(res.data);
}

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
