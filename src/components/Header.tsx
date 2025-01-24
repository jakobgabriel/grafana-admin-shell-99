import React from 'react';
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onOpenAdminPanel: () => void;
}

const Header = ({ onOpenAdminPanel }: HeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-grafana-text">Grafana Dashboard Explorer</h1>
      <Button
        variant="outline"
        onClick={onOpenAdminPanel}
        className="flex items-center gap-2"
      >
        <Settings className="w-4 h-4" />
        Admin Panel
      </Button>
    </div>
  );
};

export default Header;