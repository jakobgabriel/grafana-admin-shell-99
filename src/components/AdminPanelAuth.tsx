import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

interface AdminAuthFormData {
  email: string;
  password: string;
}

interface AdminPanelAuthProps {
  onAuthenticated: () => void;
}

const AdminPanelAuth = ({ onAuthenticated }: AdminPanelAuthProps) => {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<AdminAuthFormData>();

  const onSubmit = async (data: AdminAuthFormData) => {
    console.log('Attempting to sign in with:', data.email);
    try {
      const success = await signIn(data);
      if (success) {
        console.log('Sign in successful');
        onAuthenticated();
        toast({
          title: "Success",
          description: "Successfully authenticated",
        });
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Error",
        description: "Failed to authenticate. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 bg-grafana-background">
      <DrawerHeader>
        <DrawerTitle>Connect Instance</DrawerTitle>
        <DrawerDescription>
          Please authenticate to connect a new Grafana instance
        </DrawerDescription>
      </DrawerHeader>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Email"
            {...register("email", { required: true })}
            className="w-full"
          />
          {errors.email && (
            <span className="text-red-500">Email is required</span>
          )}
        </div>
        
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Password"
            {...register("password", { required: true })}
            className="w-full"
          />
          {errors.password && (
            <span className="text-red-500">Password is required</span>
          )}
        </div>

        <Button type="submit" className="w-full">
          Authenticate
        </Button>
      </form>
    </div>
  );
};

export default AdminPanelAuth;