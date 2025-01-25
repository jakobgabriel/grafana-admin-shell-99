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
    <Card className="border hover:shadow-lg transition-all duration-200 max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="font-semibold text-black">{dashboard.title}</span>
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
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto bg-white">
                <DialogHeader>
                  <DialogTitle className="text-black">{dashboard.title} - Configuration</DialogTitle>
                </DialogHeader>
                <pre className="bg-gray-50 p-4 rounded-lg overflow-auto whitespace-pre-wrap text-black">
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
        <p className="text-sm mb-4 text-black">{dashboard.description}</p>
        <div className="flex flex-wrap gap-2">
          {dashboard.tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="text-xs bg-grafana-accent text-white hover:bg-grafana-accent/90"
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