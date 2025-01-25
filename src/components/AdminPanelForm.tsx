import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
      <DialogHeader>
        <DialogTitle>Connect Grafana Instance</DialogTitle>
        <DialogDescription>
          Configure new Grafana instance connections here.
        </DialogDescription>
      </DialogHeader>
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
                    <Input placeholder="Production" {...field} className="bg-white" />
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
                    <Input placeholder="https://grafana.your-domain.com" {...field} className="bg-white" />
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
                    <Input type="password" placeholder="eyJr..." {...field} className="bg-white" />
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
                    <Input placeholder="1" {...field} className="bg-white" />
                  </FormControl>
                  <FormDescription>
                    Optional: Specific organization ID if needed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" className="bg-grafana-blue hover:bg-grafana-blue/90">Add Instance</Button>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
            </DialogFooter>
          </form>
        </Form>
      </div>
    </>
  );
};

export default AdminPanelForm;