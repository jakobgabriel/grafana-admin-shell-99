import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import AdminPanelAuth from './AdminPanelAuth';
import AdminPanelForm from './AdminPanelForm';
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer";

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

const ADMIN_PASSWORD = "grafana123"; // In a real app, this should be stored securely

const AdminPanel = ({ isOpen, onClose, onAddInstance }: AdminPanelProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<GrafanaInstanceFormData>({
    defaultValues: {
      name: "",
      url: "",
      apiKey: "",
      organizationId: "",
    },
  });

  const handlePasswordSubmit = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      toast({
        title: "Invalid Password",
        description: "Please enter the correct password to access admin panel",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data: GrafanaInstanceFormData) => {
    console.log("Adding new Grafana instance:", data);
    onAddInstance(data);
    form.reset();
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        {!isAuthenticated ? (
          <AdminPanelAuth onSubmit={handlePasswordSubmit} />
        ) : (
          <AdminPanelForm form={form} onSubmit={onSubmit} onClose={onClose} />
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default AdminPanel;