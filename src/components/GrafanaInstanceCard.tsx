import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash2 } from "lucide-react";
import { logUserInteraction } from "@/utils/userInteractions";
import { GrafanaInstance } from "@/types/grafana";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AdminPanelAuth from "./AdminPanelAuth";

interface Props {
  instance: GrafanaInstance;
  onRemove?: (name: string) => void;
  onRefresh?: (instance: GrafanaInstance) => void;
}

const GrafanaInstanceCard = ({ instance, onRemove, onRefresh }: Props) => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [showAuthDialog, setShowAuthDialog] = React.useState(false);

  const handleRemove = async () => {
    if (!isAdmin) {
      console.log('Unauthorized attempt to remove instance');
      setShowAuthDialog(true);
      return;
    }

    if (onRemove) {
      await logUserInteraction({
        event_type: 'remove_instance',
        component: 'GrafanaInstanceCard',
        details: { instance_name: instance.name }
      });
      onRemove(instance.name);
      toast({
        title: "Success",
        description: "Instance removed successfully",
      });
    }
  };

  const handleRefresh = async () => {
    await logUserInteraction({
      event_type: 'refresh_instance',
      component: 'GrafanaInstanceCard',
      details: { instance_name: instance.name }
    });
    if (onRefresh) {
      onRefresh(instance);
    }
  };

  const handleAuthenticated = () => {
    setShowAuthDialog(false);
    if (onRemove) {
      onRemove(instance.name);
    }
    toast({
      title: "Success",
      description: "Instance removed successfully",
    });
  };

  return (
    <>
      <Card className="w-full">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <h3 className="font-semibold">{instance.name}</h3>
            <p className="text-sm text-muted-foreground">
              {instance.folders} folders, {instance.dashboards} dashboards
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              className="text-grafana-blue hover:text-grafana-accent hover:bg-grafana-accent/10"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            {onRemove && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Instance</DialogTitle>
            <DialogDescription>
              Please authenticate as an admin to delete this instance
            </DialogDescription>
          </DialogHeader>
          <AdminPanelAuth onAuthenticated={handleAuthenticated} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GrafanaInstanceCard;