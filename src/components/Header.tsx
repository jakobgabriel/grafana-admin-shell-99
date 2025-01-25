import React from 'react';
import WelcomeSection from './WelcomeSection';

interface Props {
  onOpenAdminPanel: () => void;
  onPasteContent?: (content: any) => void;
}

const Header = ({ onOpenAdminPanel, onPasteContent }: Props) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Grafana Dashboard Explorer</h1>
      </div>
      <WelcomeSection 
        onOpenAdminPanel={onOpenAdminPanel}
        onPasteContent={onPasteContent}
      />
    </div>
  );
};

export default Header;