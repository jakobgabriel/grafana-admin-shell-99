import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
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
      
      if (!user) {
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
        setIsAdmin(data);
      }
    } catch (error) {
      console.error('Error in auth check:', error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) {
      console.error('Error signing in:', error);
      return false;
    }
    return true;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      return false;
    }
    return true;
  };

  return {
    isAdmin,
    isLoading,
    signIn,
    signOut
  };
};