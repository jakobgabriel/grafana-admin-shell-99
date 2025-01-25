import React, { useState } from 'react';
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
  const { isAdmin } = useAuth();
  
  const form = useForm<GrafanaInstanceFormData>({
    defaultValues: {
      name: "",
      url: "",
      apiKey: "",
      organizationId: "",
    },
  });

  const onSubmit = async (data: GrafanaInstanceFormData) => {
    if (!isAdmin) {
      toast({
        title: "Unauthorized",
        description: "You must be an admin to perform this action",
        variant: "destructive",
      });
      return;
    }

    await logUserInteraction({
      event_type: 'add_grafana_instance',
      component: 'AdminPanel',
      details: { instance_name: data.name }
    });

    console.log("Adding new Grafana instance:", data);
    onAddInstance(data);
    form.reset();
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        {!isAuthenticated ? (
          <AdminPanelAuth onAuthenticated={() => setIsAuthenticated(true)} />
        ) : (
          <AdminPanelForm form={form} onSubmit={onSubmit} onClose={onClose} />
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default AdminPanel;