import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('tourister_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('tourister_token') || null;
  });

  const [draftTrip, setDraftTrip] = useState(() => {
    const stored = sessionStorage.getItem('tourister_draft_trip');
    return stored ? JSON.parse(stored) : null;
  });

  const saveDraftTrip = (tripData) => {
    sessionStorage.setItem('tourister_draft_trip', JSON.stringify(tripData));
    setDraftTrip(tripData);
  };

  const clearDraftTrip = () => {
    sessionStorage.removeItem('tourister_draft_trip');
    setDraftTrip(null);
  };

  const handleAuthSuccess = (authData) => {
    const { token, id, fullName, email, phone, role } = authData;
    const userData = { id, fullName, email, phone, role };

    localStorage.setItem('tourister_token', token);
    localStorage.setItem('tourister_user', JSON.stringify(userData));

    setToken(token);
    setUser(userData);
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    handleAuthSuccess(res.data);
    return res.data;
  };

  const register = async (fullName, email, phone, password) => {
    const res = await api.post('/auth/register', { fullName, email, phone, password });
    handleAuthSuccess(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('tourister_token');
    localStorage.removeItem('tourister_user');
    setUser(null);
    setToken(null);
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isUser = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      register,
      logout,
      isAdmin,
      isUser,
      draftTrip,
      saveDraftTrip,
      clearDraftTrip
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
