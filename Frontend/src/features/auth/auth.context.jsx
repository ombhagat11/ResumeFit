import { createContext, useEffect, useState } from 'react';
import { getMe } from './services/auth.api.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function hydrate() {
      try {
        const data = await getMe();
        if (mounted && data?.user) setUser(data.user);
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    hydrate();
    return () => { mounted = false; };
  }, []);

  return <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>{children}</AuthContext.Provider>;
};
