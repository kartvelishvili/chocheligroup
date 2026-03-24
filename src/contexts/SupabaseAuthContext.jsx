import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

import { adminApi } from '@/lib/apiClient';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage
    const token = localStorage.getItem('admin_token');
    const storedUser = localStorage.getItem('admin_user');
    if (token && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setSession({ token });
      } catch (e) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = useCallback(async (email, password) => {
    try {
      const data = await adminApi.login(email, password);
      const userData = { email: data.email, role: data.role };
      setUser(userData);
      setSession({ token: data.token });
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(userData));
      return { error: null };
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign in Failed",
        description: error.message || "Something went wrong",
      });
      return { error };
    }
  }, [toast]);

  const signOut = useCallback(async () => {
    setUser(null);
    setSession(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    return { error: null };
  }, []);

  const signUp = useCallback(async () => {
    toast({
      variant: "destructive",
      title: "Sign up not available",
      description: "Registration is disabled. Contact administrator.",
    });
    return { error: { message: 'Sign up not available' } };
  }, [toast]);

  const value = useMemo(() => ({
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  }), [user, session, loading, signUp, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};