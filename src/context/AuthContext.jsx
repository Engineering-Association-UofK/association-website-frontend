import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../features/auth/api/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('sea-token') || sessionStorage.getItem('sea-token');
    const role = localStorage.getItem('role') || sessionStorage.getItem('role');
    return token ? { role } : null;
  });

  const [loading, setLoading] = useState(false);
  
  // Helper to find token in either storage
  const getStoredToken = () => localStorage.getItem('sea-token') || sessionStorage.getItem('sea-token');

  const login = async ({ name, password, isAdmin, rememberMe }) => {
    setLoading(true);
    try {
      const data = await authService.login({ name, password, isAdmin });
      // console.log('context ', data);
      // Handle "Account not verified" special case
      if (data.message === "Account not verified") {
        return { success: false, status: 'verification_needed' };
      }

      const token = data?.token || data;
      
      // Handle Storage Choice
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('sea-token', token);
      storage.setItem('role', isAdmin ? 'admin' : 'student');

      setUser({ role: isAdmin ? 'admin' : 'student' });
      return { success: true };
    } catch (error) {
      const errorData = error.response?.data;
      const serverMessage = errorData?.message || errorData?.error || (typeof errorData === 'string' ? errorData : "");
      const cleanMessage = String(serverMessage).toLowerCase().trim();
      // Check if the backend sent the verification message via error response
      if (cleanMessage.includes("account not verified")) {
        return { success: false, status: 'verification_needed' };
      }
      
      const msg = error.response?.data?.message || error.message || 'Login failed';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const sendCode = async (name) => {
    return await authService.sendVerificationCode(name);
  };

  const verifyCode = async ({ name, code }) => {
    return await authService.verifyAdmin({ name, code });
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      await authService.register(userData);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('sea-token');
    localStorage.removeItem('role');
    sessionStorage.removeItem('sea-token');
    sessionStorage.removeItem('role');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, sendCode, verifyCode, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook for easy usage
export const useAuth = () => useContext(AuthContext);