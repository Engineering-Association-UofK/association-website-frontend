import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../features/auth/api/auth.service';
import { userService } from '../features/auth/api/user.service';

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
    return JSON.parse(localStorage.getItem('sea-user') || sessionStorage.getItem('sea-user')) || null;
  });

  const [loading, setLoading] = useState(false);
  
  // Fetch user profile on mount if user exists but profile data is missing
  useEffect(() => {
    if (user?.user_id && !user.name_en) {
      fetchUserProfile(user.user_id);
    }
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const profile = await userService.getUserProfile(userId);
      const updatedUser = {
        ...user,
        ...JSON.parse(localStorage.getItem('sea-user') || sessionStorage.getItem('sea-user')),
        name_en: profile?.name_en || '',
        name_ar: profile?.name_ar || '',
        avatar_url: profile?.avatar_url || null,
      };
      setUser(updatedUser);
      // Persist to same storage
      const storage = localStorage.getItem('sea-user') ? localStorage : sessionStorage;
      storage.setItem('sea-user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

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
      const userToSet = { 
        user_id: decodedToken?.user_id,
        roles: decodedToken?.roles, 
      }
      setUser(userToSet);
      storage.setItem('sea-user', JSON.stringify(userToSet));

      // Fetch profile data (name, avatar) in the background
      try {
        const profile = await userService.getUserProfile(decodedToken?.user_id);
        const enrichedUser = {
          ...userToSet,
          name_en: profile?.name_en || '',
          name_ar: profile?.name_ar || '',
          avatar_url: profile?.avatar_url || null,
        };
        setUser(enrichedUser);
        storage.setItem('sea-user', JSON.stringify(enrichedUser));
      } catch (profileErr) {
        console.error('Failed to fetch profile after login:', profileErr);
      }

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

  // Update cached user profile data (after avatar upload, name change, etc.)
  const updateUserProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    const storage = localStorage.getItem('sea-user') ? localStorage : sessionStorage;
    storage.setItem('sea-user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    localStorage.removeItem('sea-token');
    localStorage.removeItem('sea-user');
    sessionStorage.removeItem('sea-token');
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
        login, 
        register, 
        logout, 
        sendCode, 
        verifyCode, 
        updateUserProfile,
        hasRole,
        isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook for easy usage
export const useAuth = () => useContext(AuthContext);