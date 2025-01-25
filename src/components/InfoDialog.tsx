import React from 'react';
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const InfoDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-muted/50">
          <Info className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>About Grafana Dashboard Explorer</DialogTitle>
          <DialogDescription className="space-y-4 pt-4">
            <div>
              <p className="font-medium mb-2">Overview</p>
              <p className="text-muted-foreground">
                This tool helps you manage and explore multiple Grafana instances in one place. 
                You can connect to your Grafana servers, browse dashboards, and organize them by folders.
              </p>
            </div>
            
            <div>
              <p className="font-medium mb-2">Adding a New Instance</p>
              <p className="text-muted-foreground">
                There are two ways to add a Grafana instance:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
                <li>
                  <strong>Direct Connection:</strong> Click "Add Grafana Instance" and provide your instance details including URL and API key.
                </li>
                <li>
                  <strong>API Response:</strong> Use "Paste from API" to quickly import dashboards by pasting the JSON response from Grafana's /api/search endpoint.
                </li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default InfoDialog;