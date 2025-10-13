import { useState, useEffect } from 'react';
import { checkAuth, logout as performLogout } from '@/lib/auth/adminAuth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = checkAuth();
    setIsAuthenticated(auth.isAuthenticated);
    setEmail(auth.email);
    setLoading(false);
  }, []);

  const logout = () => {
    performLogout();
    setIsAuthenticated(false);
    setEmail(null);
  };

  const refreshAuth = () => {
    const auth = checkAuth();
    setIsAuthenticated(auth.isAuthenticated);
    setEmail(auth.email);
  };

  return {
    isAuthenticated,
    email,
    loading,
    logout,
    refreshAuth,
  };
}

