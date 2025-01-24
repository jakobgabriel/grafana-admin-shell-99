import React, { useState } from 'react';
import { useForm } from "react-hook-form"
import { X } from "lucide-react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

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
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  
  const form = useForm<GrafanaInstanceFormData>({
    defaultValues: {
      name: "",
      url: "",
      apiKey: "",
      organizationId: "",
    },
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword("");
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

  if (!isAuthenticated) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Admin Authentication Required</DrawerTitle>
            <DrawerDescription>
              Please enter the admin password to continue
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                />
              </div>
              <Button type="submit">Login</Button>
            </form>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Admin Panel - Add Grafana Instance</DrawerTitle>
          <DrawerDescription>
            Configure new Grafana instance connections here. Press Ctrl + Shift + A to access this panel.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instance Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Production" {...field} />
                    </FormControl>
                    <FormDescription>
                      A friendly name for this Grafana instance
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grafana URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://grafana.your-domain.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      The base URL of your Grafana instance
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Key</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="eyJr..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Grafana API key with viewer permissions
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="organizationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization ID (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="1" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional: Specific organization ID if needed
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DrawerFooter>
                <Button type="submit">Add Instance</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AdminPanel;