import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link as LinkIcon } from "lucide-react";

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
  return (
    <Card className="bg-grafana-card text-grafana-text hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{dashboard.title}</span>
          <a 
            href={dashboard.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-grafana-blue hover:text-blue-400"
          >
            <LinkIcon size={16} />
          </a>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">{dashboard.description}</p>
        <div className="flex flex-wrap gap-2">
          {dashboard.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;