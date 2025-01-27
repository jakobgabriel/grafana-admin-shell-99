import React from 'react';
import InfoDialog from './InfoDialog';

const WelcomeSection = () => {
  return (
    <div className="text-center p-8 border-2 border-dashed rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Welcome to Grafana Dashboard Explorer</h2>
      <p className="text-muted-foreground mb-6">
        This is a static version that loads data from a GitHub repository.
        Please ensure your grafana-data.json file is properly configured.
      </p>
      <div className="flex justify-center gap-4">
        <InfoDialog />
      </div>
    </div>
  );
};

export default WelcomeSection;