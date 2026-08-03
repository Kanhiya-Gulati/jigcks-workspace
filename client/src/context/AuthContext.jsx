import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, logoutApi, getMe } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('jigcks_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await getMe();
          setUser(res.data.data);
        } catch (error) {
          console.error("Failed to fetch user", error);
          localStorage.removeItem('jigcks_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  // Single Session Heartbeat Check (detects if user logged in elsewhere within 6 seconds)
  useEffect(() => {
    if (!token || !user) return;

    const interval = setInterval(async () => {
      try {
        await getMe();
      } catch (err) {
        // Interceptor will handle 401 and redirect to login?reason=session_expired
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [token, user]);

  // Sync across tabs in same browser
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'jigcks_token') {
        if (!e.newValue) {
          setToken(null);
          setUser(null);
        } else if (e.newValue !== token) {
          setToken(e.newValue);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [token]);

  const login = async (username, password) => {
    const res = await apiLogin(username, password);
    const loginData = res.data.data;
    localStorage.setItem('jigcks_token', loginData.token);
    setToken(loginData.token);
    setUser(loginData.user);
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem('jigcks_token');
      setToken(null);
      setUser(null);
      window.location.href = '/login';
    }
  };

  const isAdmin = user?.role === 'admin';

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
