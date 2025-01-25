import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link as LinkIcon, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Dashboard {
  title: string;
  description: string;
  url: string;
  tags: string[];
}

interface Props {
  dashboard: Dashboard;
}

const DashboardCard = ({ dashboard }: Props) => {
  console.log('Rendering dashboard card for:', dashboard.title);
  
  return (
    <Card className="bg-grafana-card text-grafana-text hover:shadow-xl transition-all duration-200 max-w-2xl border-grafana-accent/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-grafana-text font-semibold">{dashboard.title}</span>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-grafana-blue hover:text-grafana-accent hover:bg-grafana-accent/10"
                >
                  <Code size={16} />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto bg-grafana-background border-grafana-accent/30">
                <DialogHeader>
                  <DialogTitle className="text-grafana-text">{dashboard.title} - Configuration</DialogTitle>
                </DialogHeader>
                <pre className="bg-grafana-card p-4 rounded-lg overflow-auto whitespace-pre-wrap text-grafana-text">
                  {JSON.stringify(dashboard, null, 2)}
                </pre>
              </DialogContent>
            </Dialog>
            <a 
              href={dashboard.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-grafana-blue hover:text-grafana-accent transition-colors p-2 rounded-full hover:bg-grafana-accent/10"
            >
              <LinkIcon size={16} />
            </a>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4 text-grafana-text/90">{dashboard.description}</p>
        <div className="flex flex-wrap gap-2">
          {dashboard.tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="text-xs bg-grafana-accent/20 text-grafana-text hover:bg-grafana-accent/30"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;