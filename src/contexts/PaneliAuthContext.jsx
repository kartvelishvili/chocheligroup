import React, { createContext, useContext, useState, useEffect } from 'react';

const PaneliAuthContext = createContext();

export const usePaneliAuth = () => {
  const ctx = useContext(PaneliAuthContext);
  if (!ctx) throw new Error('usePaneliAuth must be used within PaneliAuthProvider');
  return ctx;
};

const CREDENTIALS = {
  username: 'chocheli',
  password: 'Panel2025!secure'
};

export const PaneliAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem('paneli_session');
    if (raw) {
      try {
        const s = JSON.parse(raw);
        if (s.expiry && Date.now() < s.expiry) {
          setIsAuthenticated(true);
          setUser(s.user);
        } else {
          localStorage.removeItem('paneli_session');
        }
      } catch {
        localStorage.removeItem('paneli_session');
      }
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
      const session = {
        user: { username, role: 'panel_admin' },
        expiry: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
      };
      localStorage.setItem('paneli_session', JSON.stringify(session));
      setIsAuthenticated(true);
      setUser(session.user);
      return { success: true };
    }
    return { success: false, error: 'არასწორი მომხმარებელი ან პაროლი' };
  };

  const logout = () => {
    localStorage.removeItem('paneli_session');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <PaneliAuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </PaneliAuthContext.Provider>
  );
};
