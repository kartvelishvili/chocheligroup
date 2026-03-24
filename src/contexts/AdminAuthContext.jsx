import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

// Admin credentials
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'Chocheli2024!'
};

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed.expiry && Date.now() < parsed.expiry) {
          setIsAuthenticated(true);
          setAdminUser(parsed.user);
        } else {
          localStorage.removeItem('admin_session');
        }
      } catch {
        localStorage.removeItem('admin_session');
      }
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const session = {
        user: { username, role: 'admin' },
        expiry: Date.now() + 24 * 60 * 60 * 1000
      };
      localStorage.setItem('admin_session', JSON.stringify(session));
      setIsAuthenticated(true);
      setAdminUser(session.user);
      return { success: true };
    }
    return { success: false, error: 'არასწორი მომხმარებელი ან პაროლი' };
  };

  const logout = () => {
    localStorage.removeItem('admin_session');
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, adminUser, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};