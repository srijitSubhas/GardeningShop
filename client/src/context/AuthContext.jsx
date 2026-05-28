import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

/**
 * AuthProvider - wraps the app and provides authentication state
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking session

  // Check existing session on first load
  useEffect(() => {
    authAPI
      .me()
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    await authAPI.login({ email, password });
    const meRes = await authAPI.me();
    setUser(meRes.data.user);
    return { user: meRes.data.user };
  }, []);

  const signup = useCallback(async (name, email, password, phone) => {
    await authAPI.signup({ name, email, password, phone });
    const meRes = await authAPI.me();
    setUser(meRes.data.user);
    return { user: meRes.data.user };
  }, []);

  const logout = useCallback(async () => {
    await authAPI.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth - consume auth context in any component
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}
