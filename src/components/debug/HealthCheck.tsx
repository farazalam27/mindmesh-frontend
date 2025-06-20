'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { healthChecks } from '@/lib/api';

interface ServiceStatus {
  ideas: boolean | null;
  voting: boolean | null;
  decision: boolean | null;
}

export function HealthCheck() {
  const [status, setStatus] = useState<ServiceStatus>({
    ideas: null,
    voting: null,
    decision: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkServices = async () => {
      setLoading(true);
      try {
        const results = await healthChecks.checkAllServices();
        setStatus(results);
      } catch (error) {
        console.error('Error checking service health:', error);
        setStatus({
          ideas: false,
          voting: false,
          decision: false,
        });
      } finally {
        setLoading(false);
      }
    };

    checkServices();
    
    // Check every 30 seconds
    const interval = setInterval(checkServices, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (isHealthy: boolean | null) => {
    if (isHealthy === null) {
      return <Badge variant="outline"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Checking</Badge>;
    }
    return isHealthy ? 
      <Badge className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Online</Badge> :
      <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Offline</Badge>;
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">Backend Status</CardTitle>
        <CardDescription>
          Real-time status of MindMesh backend services
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Ideas Service</span>
          {getStatusBadge(status.ideas)}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Voting Service</span>
          {getStatusBadge(status.voting)}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Decision Service</span>
          {getStatusBadge(status.decision)}
        </div>
        <div className="pt-2 border-t text-xs text-gray-500">
          Last checked: {loading ? 'Checking...' : new Date().toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}