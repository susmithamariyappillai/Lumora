import { createContext, useContext, useEffect, useState } from 'react';
import { getToken, setToken } from '../services/api';
import * as auth from '../services/authService';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) return;

    auth.fetchMe()
      .then(setUser)
      .catch((e) => {
        if (e.status === 401) setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = {
    user,
    loading,
    login: async (email, password) => {
      const u = await auth.login(email, password);
      setUser(u);
      return u;
    },
    register: async (form) => {
      const u = await auth.register(form);
      setUser(u);
      return u;
    },
    updateName: async (name) => setUser(await auth.updateName(name)),
    logout: async () => {
      await auth.logoutRequest();
      setToken(null);
      setUser(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}