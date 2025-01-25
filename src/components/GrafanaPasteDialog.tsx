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

interface GrafanaPasteDialogProps {
  onPasteContent: (content: any) => void;
}

const GrafanaPasteDialog = ({ onPasteContent }: GrafanaPasteDialogProps) => {
  const [content, setContent] = React.useState('');
  const { toast } = useToast();

  const handlePaste = async () => {
    try {
      const parsedContent = JSON.parse(content);
      await logUserInteraction({
        event_type: 'paste_grafana_content',
        component: 'GrafanaPasteDialog',
        details: { success: true }
      });
      onPasteContent(parsedContent);
      toast({
        title: "Content pasted successfully",
        description: "The Grafana search API content has been processed",
      });
    } catch (error) {
      console.error('Error parsing pasted content:', error);
      await logUserInteraction({
        event_type: 'paste_grafana_content',
        component: 'GrafanaPasteDialog',
        details: { success: false, error: 'Invalid JSON format' }
      });
      toast({
        title: "Invalid content",
        description: "Please paste valid JSON from the Grafana search API",
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
            Paste the JSON response from Grafana's /api/search endpoint here
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Paste your JSON content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px]"
          />
          <Button onClick={handlePaste}>Process Content</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GrafanaPasteDialog;