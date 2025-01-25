import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import AdminPanelAuth from './AdminPanelAuth';
import AdminPanelForm from './AdminPanelForm';
import { logUserInteraction } from "@/utils/userInteractions";
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer";
import { useAuth } from "@/hooks/useAuth";

interface GrafanaInstanceFormData {
  name: string;
  url: string;
  apiKey: string;
  organizationId?: string;
}

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAddInstance: (instance: GrafanaInstanceFormData) => void;
}

const AdminPanel = ({ isOpen, onClose, onAddInstance }: AdminPanelProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const { isAdmin, signOut } = useAuth();
  
  const form = useForm<GrafanaInstanceFormData>({
    defaultValues: {
      name: "",
      url: "",
      apiKey: "",
      organizationId: "",
    },
  });

  const handleClose = async () => {
    console.log('Closing connect instance panel and logging out');
    try {
      await signOut();
      setIsAuthenticated(false);
      onClose();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Error",
        description: "Failed to log out properly",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: GrafanaInstanceFormData) => {
    console.log('Submitting instance data:', data);
    console.log('Current admin status:', isAdmin);

    if (!isAdmin) {
      console.error('Unauthorized: User is not an admin');
      toast({
        title: "Unauthorized",
        description: "You must be an admin to perform this action",
        variant: "destructive",
      });
      return;
    }

    try {
      await logUserInteraction({
        event_type: 'add_grafana_instance',
        component: 'ConnectInstance',
        details: { instance_name: data.name }
      });

      console.log("Adding new Grafana instance:", data);
      onAddInstance(data);
      toast({
        title: "Success",
        description: `Added Grafana instance: ${data.name}`,
      });
      form.reset();
      handleClose();
    } catch (error) {
      console.error('Error adding Grafana instance:', error);
      toast({
        title: "Error",
        description: "Failed to add Grafana instance. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAuthenticated = () => {
    console.log('Authentication successful in ConnectInstance');
    setIsAuthenticated(true);
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent className="bg-grafana-background">
        {!isAuthenticated ? (
          <AdminPanelAuth onAuthenticated={handleAuthenticated} />
        ) : (
          <AdminPanelForm form={form} onSubmit={onSubmit} onClose={handleClose} />
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default AdminPanel;