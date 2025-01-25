import React from 'react';
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import GrafanaPasteDialog from './GrafanaPasteDialog';
import InfoDialog from './InfoDialog';

interface Props {
  onOpenAdminPanel: () => void;
  onPasteContent?: (content: any) => void;
}

const WelcomeSection = ({ onOpenAdminPanel, onPasteContent }: Props) => {
  return (
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
        {onPasteContent && (
          <GrafanaPasteDialog onPasteContent={onPasteContent} />
        )}
        <InfoDialog />
      </div>
    </div>
  );
};

export default WelcomeSection;