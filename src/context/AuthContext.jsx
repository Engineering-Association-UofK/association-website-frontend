import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../features/auth/api/auth.service';

const AuthContext = createContext(null);
  
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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // const token = localStorage.getItem('sea-token') || sessionStorage.getItem('sea-token');
    // console.log('sss', JSON.parse(localStorage.getItem('sea-user') || sessionStorage.getItem('sea-user')) || null, token);
    return JSON.parse(localStorage.getItem('sea-user') || sessionStorage.getItem('sea-user')) || null;
  });

  const [loading, setLoading] = useState(false);
  // const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  
  const login = async ({ username, password, rememberMe }) => {
    setLoading(true);
    try {
      const data = await authService.login({ username, password });
      console.log('context ', data);
      // Handle "Account not verified" special case
      if (!data.token) {
        console.log("cont", data.user_id ?? null);
        
        return { success: false, status: 'verification_needed', user_id: data.user_id ?? null };
      }

      const token = data?.token || data;
      const decodedToken = parseJwt(token)
      console.log('token', parseJwt(token));
      
      // Handle Storage Choice
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('sea-token', token);
      // storage.setItem('roles', decodedToken?.roles);
      const userToSet = { 
        user_id: decodedToken?.user_id,
        username: decodedToken?.username,
        email: decodedToken?.email,
        roles: decodedToken?.roles, 
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
      return { success: false, message: msg, user_id: errorData?.user_id ?? null, };
    } finally {
      setLoading(false);
    }
  };

  const sendCode = async (user_id) => {
    return await authService.sendVerificationCode(user_id);
  };

  const verifyCode = async ({ user_id, code }) => {
    return await authService.verifyCode({ user_id, code });
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

  // Helper to find token in either storage
  // const getStoredToken = () => localStorage.getItem('sea-token') || sessionStorage.getItem('sea-token');


  // const changePassword = async ({ oldPassword, newPassword, confirmPassword }) => {
  //   setChangePasswordLoading(true);
  //   try {
  //     await authService.changePassword({ oldPassword, newPassword, confirmPassword });
  //     return { success: true, message: "Password updated successfully" };
  //   } catch (error) {
  //     const errorData = error.response?.data;
  //     const msg = errorData?.message || errorData?.error || (typeof errorData === 'string' ? errorData : "") || "Failed to update password";
  //     return { success: false, message: msg };
  //   } finally {
  //     setChangePasswordLoading(false);
  //   }
  // };


  const logout = () => {
    localStorage.removeItem('sea-token');
    // localStorage.removeItem('role');
    localStorage.removeItem('sea-user');
    sessionStorage.removeItem('sea-token');
    // sessionStorage.removeItem('role');
    sessionStorage.removeItem('sea-user');
    setUser(null);
  };

  const hasRole = (...roles) =>
    user?.roles?.some((r) => roles.includes(r)) ?? false;

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        // changePasswordLoading, 
        login, 
        register, 
        logout, 
        sendCode, 
        verifyCode, 
        // changePassword, 
        hasRole,
        isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook for easy usage
export const useAuth = () => useContext(AuthContext);