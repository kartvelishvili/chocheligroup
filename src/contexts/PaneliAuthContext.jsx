import React, { createContext, useContext, useState, useEffect } from 'react';

const PaneliAuthContext = createContext();

export const usePaneliAuth = () => {
  const ctx = useContext(PaneliAuthContext);
  if (!ctx) throw new Error('usePaneliAuth must be used within PaneliAuthProvider');
  return ctx;
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

  const login = async (username, password) => {
    try {
      const res = await fetch('/api/paneli/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'არასწორი მომხმარებელი ან პაროლი' };
      }
      const session = {
        user: data.user,
        expiry: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
      };
      localStorage.setItem('paneli_session', JSON.stringify(session));
      setIsAuthenticated(true);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'სერვერთან დაკავშირება ვერ მოხერხდა' };
    }
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
