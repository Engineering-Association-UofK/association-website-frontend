import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../features/auth/api/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // const token = localStorage.getItem('sea-token') || sessionStorage.getItem('sea-token');
    // console.log('sss', JSON.parse(localStorage.getItem('sea-user') || sessionStorage.getItem('sea-user')) || null, token);
    return JSON.parse(localStorage.getItem('sea-user') || sessionStorage.getItem('sea-user')) || null;
  });

  const [loading, setLoading] = useState(false);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  
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
      const decodedToken = parseJwt(token)
      console.log('token', parseJwt(token));
      
      // Handle Storage Choice
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('sea-token', token);
      // storage.setItem('roles', decodedToken?.roles);
      const userToSet = { 
        roles: decodedToken?.roles, 
        type: decodedToken?.type, 
        name: decodedToken?.name,
        email: decodedToken?.email 
      }
      setUser(userToSet);
      storage.setItem('sea-user', JSON.stringify(userToSet));
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

  const changePassword = async ({ oldPassword, newPassword, confirmPassword }) => {
    setChangePasswordLoading(true);
    try {
      await authService.changePassword({ oldPassword, newPassword, confirmPassword });
      return { success: true, message: "Password updated successfully" };
    } catch (error) {
      const errorData = error.response?.data;
      const msg = errorData?.message || errorData?.error || (typeof errorData === 'string' ? errorData : "") || "Failed to update password";
      return { success: false, message: msg };
    } finally {
      setChangePasswordLoading(false);
    }
  };


  const logout = () => {
    localStorage.removeItem('sea-token');
    // localStorage.removeItem('role');
    localStorage.removeItem('sea-user');
    sessionStorage.removeItem('sea-token');
    // sessionStorage.removeItem('role');
    sessionStorage.removeItem('sea-user');
    setUser(null);
  };
  
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, changePasswordLoading, login, register, logout, sendCode, verifyCode, changePassword, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook for easy usage
export const useAuth = () => useContext(AuthContext);