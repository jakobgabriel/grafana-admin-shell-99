import React from 'react';
import WelcomeSection from './WelcomeSection';
import InfoDialog from './InfoDialog';

interface Props {
  onOpenAdminPanel: () => void;
  onPasteContent?: (content: any) => void;
}

const Header = ({ onOpenAdminPanel, onPasteContent }: Props) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Grafana Dashboard Explorer</h1>
        <InfoDialog />
      </div>
      <WelcomeSection 
        onOpenAdminPanel={onOpenAdminPanel}
        onPasteContent={onPasteContent}
      />
    </div>
  );
};

export default Header;