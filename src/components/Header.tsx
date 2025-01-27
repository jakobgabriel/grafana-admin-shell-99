import React from 'react';
import WelcomeSection from './WelcomeSection';
import InfoDialog from './InfoDialog';

interface Props {
  showWelcome?: boolean;
}

const Header = ({ showWelcome = true }: Props) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Grafana Dashboard Explorer</h1>
        <div className="flex items-center gap-4">
          <InfoDialog />
        </div>
      </div>
      {showWelcome && (
        <WelcomeSection />
      )}
    </div>
  );
};

export default Header;