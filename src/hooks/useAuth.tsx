import { useEffect, useState } from 'react';

export const useAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // In GitHub version, we don't have authentication
    setIsLoading(false);
    setIsAdmin(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Sign in not supported in GitHub version');
    return { error: 'Authentication not supported in GitHub version' };
  };

  const signOut = async () => {
    console.log('Sign out not supported in GitHub version');
    return false;
  };

  return {
    isAdmin,
    isLoading,
    signIn,
    signOut
  };
};