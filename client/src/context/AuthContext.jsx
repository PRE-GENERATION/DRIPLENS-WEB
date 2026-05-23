import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true); // true on first load

  // On mount — rehydrate from localStorage and handle Google OAuth callback
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser  = localStorage.getItem('user');
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setLoading(false);
          return;
        }

        // Try to fetch Supabase session if redirected back from Google OAuth
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.access_token) {
          const oauthRole = localStorage.getItem('oauth_role') || 'creator';
          const res = await api.post('/auth/oauth-callback', {
            token: session.access_token,
            role: oauthRole
          });
          const { access_token, user: userData } = res.data.data;
          
          localStorage.setItem('token', access_token);
          localStorage.setItem('user', JSON.stringify(userData));
          setToken(access_token);
          setUser(userData);
        }
      } catch (err) {
        console.error('Auth initialization / OAuth callback failed:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    const { access_token, user: userData } = data.data;
    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(access_token);
    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (username, email, password, role, extra = {}) => {
    const data = await api.post('/auth/register', { username, email, password, role, ...extra });
    const { access_token, user: userData } = data.data;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(access_token);
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((newData) => {
    setUser(prev => {
      const updated = { ...prev, ...newData };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = { user, token, loading, login, register, logout, updateUser, isLoggedIn: !!token };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
