import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface GrafanaInstanceFormData {
  name: string;
  url: string;
  apiKey: string;
  organizationId?: string;
}

interface AdminPanelFormProps {
  form: UseFormReturn<GrafanaInstanceFormData>;
  onSubmit: (data: GrafanaInstanceFormData) => void;
  onClose: () => void;
}

const AdminPanelForm = ({ form, onSubmit, onClose }: AdminPanelFormProps) => {
  return (
    <>
      <DrawerHeader>
        <DrawerTitle>Admin Panel - Add Grafana Instance</DrawerTitle>
        <DrawerDescription>
          Configure new Grafana instance connections here.
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
    </>
  );
};

export default AdminPanelForm;