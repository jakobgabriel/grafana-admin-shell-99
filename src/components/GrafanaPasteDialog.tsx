import React from 'react';
import { ClipboardPaste } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const { toast } = useToast();

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

  const handlePaste = async () => {
    try {
      const parsedContent = JSON.parse(content);
      
      if (!validateGrafanaSearchResponse(parsedContent)) {
        throw new Error('Invalid Grafana Search API response format');
      }

      console.log('Processing Grafana Search API content:', parsedContent);
      
      await logUserInteraction({
        event_type: 'paste_grafana_content',
        component: 'GrafanaPasteDialog',
        details: { success: true, items_count: parsedContent.length }
      });

      onPasteContent(parsedContent);
      
      toast({
        title: "Content pasted successfully",
        description: `Processed ${parsedContent.length} items from Grafana search API`,
      });
    } catch (error) {
      console.error('Error parsing pasted content:', error);
      await logUserInteraction({
        event_type: 'paste_grafana_content',
        component: 'GrafanaPasteDialog',
        details: { 
          success: false, 
          error: error instanceof Error ? error.message : 'Invalid JSON format' 
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <ClipboardPaste className="w-4 h-4" />
          Paste from API
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Paste Grafana Search API Content</DialogTitle>
          <DialogDescription>
            Paste the JSON response from Grafana's /api/search endpoint. The content should be an array of dashboard and folder items.
            <br />
            <br />
            Example format:
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
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Paste your JSON content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px] font-mono"
          />
          <Button onClick={handlePaste}>Process Content</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GrafanaPasteDialog;