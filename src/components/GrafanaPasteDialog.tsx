import React, { useState } from 'react';
import { ClipboardPaste } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { logUserInteraction } from "@/utils/userInteractions";
import { useAuth } from "@/hooks/useAuth";
import AdminPanelAuth from './AdminPanelAuth';

interface GrafanaSearchItem {
  id: number;
  uid: string;
  title: string;
  uri: string;
  url: string;
  slug: string;
  type: string;
  tags: string[];
  isStarred: boolean;
  folderId?: number;
  folderUid?: string;
  folderTitle?: string;
  folderUrl?: string;
  sortMeta?: number;
}

interface GrafanaPasteDialogProps {
  onPasteContent: (content: any) => void;
}

const GrafanaPasteDialog = ({ onPasteContent }: GrafanaPasteDialogProps) => {
  const [content, setContent] = React.useState('');
  const [instanceName, setInstanceName] = React.useState('');
  const [instanceUrl, setInstanceUrl] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const { signOut } = useAuth();

  const validateGrafanaSearchResponse = (data: any[]): data is GrafanaSearchItem[] => {
    if (!Array.isArray(data)) return false;
    
    return data.every(item => 
      typeof item === 'object' &&
      typeof item.id === 'number' &&
      typeof item.uid === 'string' &&
      typeof item.title === 'string' &&
      typeof item.type === 'string' &&
      Array.isArray(item.tags)
    );
  };

  const handleClose = async () => {
    console.log('Closing paste dialog and logging out');
    try {
      await signOut();
      setIsAuthenticated(false);
      setIsOpen(false);
      setContent('');
      setInstanceName('');
      setInstanceUrl('');
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Error",
        description: "Failed to log out properly",
        variant: "destructive",
      });
    }
  };

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  const handlePaste = async () => {
    if (!instanceName.trim()) {
      toast({
        title: "Instance name required",
        description: "Please provide a name for this Grafana instance",
        variant: "destructive",
      });
      return;
    }

    if (!instanceUrl.trim()) {
      toast({
        title: "Instance URL required",
        description: "Please provide the base URL of your Grafana instance",
        variant: "destructive",
      });
      return;
    }

    try {
      const parsedContent = JSON.parse(content);
      
      if (!validateGrafanaSearchResponse(parsedContent)) {
        throw new Error('Invalid Grafana Search API response format');
      }

      console.log('Processing Grafana Search API content:', parsedContent);
      
      const transformedContent = parsedContent.map(item => ({
        ...item,
        url: `${instanceUrl.replace(/\/$/, '')}${item.url}`,
      }));

      await logUserInteraction({
        event_type: 'paste_grafana_content',
        component: 'GrafanaPasteDialog',
        details: { 
          success: true, 
          items_count: transformedContent.length,
          instance_name: instanceName,
          instance_url: instanceUrl
        }
      });

      onPasteContent({
        content: transformedContent,
        name: instanceName,
        url: instanceUrl
      });
      
      toast({
        title: "Content pasted successfully",
        description: `Processed ${transformedContent.length} items from Grafana search API`,
      });

      handleClose();
    } catch (error) {
      console.error('Error parsing pasted content:', error);
      await logUserInteraction({
        event_type: 'paste_grafana_content',
        component: 'GrafanaPasteDialog',
        details: { 
          success: false, 
          error: error instanceof Error ? error.message : 'Invalid JSON format',
          instance_name: instanceName,
          instance_url: instanceUrl
        }
      });
      
      toast({
        title: "Invalid content",
        description: "Please paste a valid JSON response from the Grafana search API. The content should be an array of dashboard and folder items.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open ? setIsOpen(true) : handleClose()}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2" onClick={() => setIsOpen(true)}>
          <ClipboardPaste className="w-4 h-4" />
          Paste from API
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        {!isAuthenticated ? (
          <AdminPanelAuth onAuthenticated={handleAuthenticated} />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Paste Grafana Search API Content</DialogTitle>
              <DialogDescription>
                Paste the JSON response from Grafana's /api/search endpoint. The content should be an array of dashboard and folder items.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="instanceName" className="text-sm font-medium">Instance Name</label>
                <Input
                  id="instanceName"
                  placeholder="Enter instance name..."
                  value={instanceName}
                  onChange={(e) => setInstanceName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="instanceUrl" className="text-sm font-medium">Instance URL</label>
                <Input
                  id="instanceUrl"
                  placeholder="https://your-grafana-instance.com"
                  value={instanceUrl}
                  onChange={(e) => setInstanceUrl(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="content" className="text-sm font-medium">API Response</label>
                <Textarea
                  id="content"
                  placeholder="Paste your JSON content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px] font-mono"
                />
              </div>
              <div>
                <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-x-auto">
                  {JSON.stringify([
                    {
                      "id": 1,
                      "uid": "lBdLINUWk",
                      "title": "Production Overview",
                      "uri": "db/production-overview",
                      "url": "/d/lBdLINUWk/production-overview",
                      "slug": "",
                      "type": "dash-db",
                      "tags": ["production"],
                      "isStarred": false
                    }
                  ], null, 2)}
                </pre>
              </div>
              <Button onClick={handlePaste}>Process Content</Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GrafanaPasteDialog;