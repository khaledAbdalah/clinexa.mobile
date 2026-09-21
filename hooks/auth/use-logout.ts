import { router } from 'expo-router';
import { useState } from 'react';

import { routes } from '@/constants/routes';
import { useAuthStore } from '@/store/auth';

export function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.replace(routes.welcome);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return { handleLogout, isLoggingOut };
}
