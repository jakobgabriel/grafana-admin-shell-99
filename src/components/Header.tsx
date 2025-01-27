import React from 'react';
import { Plus, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import WelcomeSection from './WelcomeSection';
import GrafanaPasteDialog from './GrafanaPasteDialog';
import InfoDialog from './InfoDialog';
import { useNavigate } from 'react-router-dom';

interface Props {
  onOpenAdminPanel: () => void;
  onPasteContent?: (content: any) => void;
  showWelcome?: boolean;
}

const Header = ({ onOpenAdminPanel, onPasteContent, showWelcome = true }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Grafana Dashboard Explorer</h1>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/management')}
            className="flex items-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            Statistics
          </Button>
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
      {showWelcome && (
        <WelcomeSection 
          onOpenAdminPanel={onOpenAdminPanel}
          onPasteContent={onPasteContent}
          buttonsHidden={true}
        />
      )}
    </div>
  );
};

export default Header;