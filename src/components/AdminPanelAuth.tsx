import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface AdminPanelAuthProps {
  onAuthenticated: () => void;
}

const AdminPanelAuth = ({ onAuthenticated }: AdminPanelAuthProps) => {
  const { isAdmin, isLoading, signIn } = useAuth();

  React.useEffect(() => {
    if (isAdmin) {
      onAuthenticated();
    }
  }, [isAdmin, onAuthenticated]);

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
          Please sign in with your Google account to access the admin panel
        </DrawerDescription>
      </DrawerHeader>
      <div className="p-4">
        <Button 
          onClick={signIn}
          className="w-full"
        >
          Sign in with Google
        </Button>
      </div>
    </>
  );
};

export default AdminPanelAuth;