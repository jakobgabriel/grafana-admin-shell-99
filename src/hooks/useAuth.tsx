import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      checkAdminStatus();
    });

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user?.id);
      
      if (!user) {
        console.log('No user found');
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin'
      });

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } else {
        console.log('Admin status:', data);
        setIsAdmin(data);
      }
    } catch (error) {
      console.error('Error in auth check:', error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('Attempting to sign in with email:', email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Sign in error:', error);
        return { error: error.message };
      }

      console.log('Sign in successful:', data.user?.id);
      return { error: null };
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        return false;
      }
      console.log('Sign out successful');
      return true;
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
      return false;
    }
  };

  return {
    isAdmin,
    isLoading,
    signIn,
    signOut
  };
};