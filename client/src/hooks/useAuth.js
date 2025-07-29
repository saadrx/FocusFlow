
import { authService } from '@/lib/auth';
import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = () => {
      try {
        const userData = authService.getUser();
        setUser(userData);
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    logout,
    isAuthenticated: authService.isAuthenticated()
  };
}
