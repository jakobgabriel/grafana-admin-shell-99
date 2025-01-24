import React from 'react';
import { Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Props {
  onOpenAdminPanel: () => void;
}

const WelcomeSection = ({ onOpenAdminPanel }: Props) => {
  return (
    <div className="space-y-6">
      <div className="text-center p-8 border-2 border-dashed rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Welcome to Grafana Dashboard Explorer</h2>
        <p className="text-muted-foreground mb-6">
          Get started by adding your first Grafana instance or explore the demo view
        </p>
        <div className="flex justify-center gap-4">
          <Button
            onClick={onOpenAdminPanel}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Grafana Instance
          </Button>
        </div>
      </div>
      
      <Alert className="bg-muted/50">
        <Info className="h-4 w-4" />
        <AlertDescription className="ml-6">
          <p className="font-medium mb-2">About Grafana Dashboard Explorer</p>
          <p className="text-sm text-muted-foreground">
            This tool helps you manage and explore multiple Grafana instances in one place. 
            You can connect to your Grafana servers, browse dashboards, and organize them by folders. 
            The demo view shows you example instances to help you get started.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default WelcomeSection;