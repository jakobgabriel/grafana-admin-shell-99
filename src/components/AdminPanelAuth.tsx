import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

interface AdminPanelAuthProps {
  onSubmit: (password: string) => void;
}

const AdminPanelAuth = ({ onSubmit }: AdminPanelAuthProps) => {
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
    setPassword("");
  };

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>Admin Authentication Required</DrawerTitle>
        <DrawerDescription>
          Please enter the admin password to continue
        </DrawerDescription>
      </DrawerHeader>
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
            />
          </div>
          <Button type="submit">Login</Button>
        </form>
      </div>
    </>
  );
};

export default AdminPanelAuth;