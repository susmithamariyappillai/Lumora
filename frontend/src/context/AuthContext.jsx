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

  // Store authentication functions and user details
  const value = {
    user,
    loading,

    // Login user
    login: async (email, password) => {
      const u = await auth.login(email, password);
      setUser(u);
      return u;
    },

    // Register new user
    register: async (form) => {
      const u = await auth.register(form);
      setUser(u);
      return u;
    },

    // Update user name
    updateName: async (name) => {
      setUser(await auth.updateName(name));
    },

    // Logout user
    logout: async () => {
      await auth.logoutRequest();
      setToken(null);
      setUser(null);
    },
  };

  // Share authentication data with all child components
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}