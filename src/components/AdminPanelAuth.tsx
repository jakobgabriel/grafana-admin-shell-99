import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminPanelAuthProps {
  onAuthenticated: () => void;
}

const AdminPanelAuth = ({ onAuthenticated }: AdminPanelAuthProps) => {
  const { isAdmin, isLoading, signIn } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (isAdmin) {
      console.log('User is admin, triggering onAuthenticated');
      onAuthenticated();
    }
  }, [isAdmin, onAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Submitting auth form with email:', email);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Authentication error:', error);
        toast({
          title: "Authentication failed",
          description: error,
          variant: "destructive",
        });
      } else {
        console.log('Authentication successful');
        toast({
          title: "Authentication successful",
          description: "You are now logged in as admin",
        });
      }
    } catch (error) {
      console.error('Unexpected authentication error:', error);
      toast({
        title: "Authentication failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>Admin Authentication Required</DrawerTitle>
        <DrawerDescription>
          Please sign in with your admin credentials to access the admin panel
        </DrawerDescription>
      </DrawerHeader>
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button 
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Sign in
        </Button>
      </form>
    </>
  );
};

export default AdminPanelAuth;