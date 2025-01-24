import React from 'react';
import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Footer = () => {
  return (
    <footer className="mt-auto py-6 px-4">
      <Alert className="bg-muted/50 max-w-4xl mx-auto">
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
    </footer>
  );
};

export default Footer;