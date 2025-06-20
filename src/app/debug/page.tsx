'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/stores/auth';
import { ideasService, votingService, healthChecks } from '@/lib/api';

export default function DebugPage() {
  const { user, token, isAuthenticated } = useAuth();
  const [results, setResults] = useState<any[]>([]);

  const addResult = (title: string, data: any, success: boolean = true) => {
    setResults(prev => [...prev, { 
      title, 
      data, 
      success, 
      timestamp: new Date().toLocaleTimeString() 
    }]);
  };

  const testHealthCheck = async () => {
    try {
      const health = await healthChecks.checkAllServices();
      addResult('Health Check', health, true);
    } catch (error) {
      addResult('Health Check', error, false);
    }
  };

  const testGetIdeas = async () => {
    try {
      const ideas = await ideasService.getIdeas();
      addResult('Get Ideas', `Found ${ideas.length || ideas.items?.length || 0} ideas`, true);
    } catch (error) {
      addResult('Get Ideas', error, false);
    }
  };

  const testCreateIdea = async () => {
    try {
      const testIdea = {
        title: `Debug Test Idea ${Date.now()}`,
        description: 'This is a test idea created from the debug page',
        category: 'other' as const,
        tags: ['debug', 'test']
      };
      const result = await ideasService.createIdea(testIdea);
      addResult('Create Idea', result, true);
    } catch (error) {
      addResult('Create Idea', error, false);
    }
  };

  const testVoting = async () => {
    try {
      const voteData = await votingService.getVoteAggregates(1);
      addResult('Get Vote Data', voteData, true);
    } catch (error) {
      addResult('Get Vote Data', error, false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Debug & Testing</h1>
        <p className="text-gray-600">Test backend connectivity and API calls</p>
      </div>

      {/* Auth Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Authentication Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Authenticated:</span>
              <Badge variant={isAuthenticated ? 'default' : 'destructive'}>
                {isAuthenticated ? 'Yes' : 'No'}
              </Badge>
            </div>
            {user && (
              <>
                <div className="flex items-center justify-between">
                  <span>User:</span>
                  <span>{user.name} ({user.email})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Roles:</span>
                  <span>{user.roles.join(', ')}</span>
                </div>
              </>
            )}
            <div className="flex items-center justify-between">
              <span>Token:</span>
              <span className="text-xs text-gray-500">
                {token ? `${token.substring(0, 20)}...` : 'None'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Buttons */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>API Tests</CardTitle>
          <CardDescription>Click buttons to test various API endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button onClick={testHealthCheck} variant="outline">
              Health Check
            </Button>
            <Button onClick={testGetIdeas} variant="outline">
              Get Ideas
            </Button>
            <Button onClick={testCreateIdea} variant="outline" disabled={!isAuthenticated}>
              Create Test Idea
            </Button>
            <Button onClick={testVoting} variant="outline" disabled={!isAuthenticated}>
              Test Voting
            </Button>
          </div>
          <div className="mt-4">
            <Button onClick={clearResults} variant="destructive" size="sm">
              Clear Results
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No test results yet</p>
            ) : (
              results.map((result, index) => (
                <div key={index} className="border rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{result.title}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant={result.success ? 'default' : 'destructive'}>
                        {result.success ? 'Success' : 'Error'}
                      </Badge>
                      <span className="text-xs text-gray-500">{result.timestamp}</span>
                    </div>
                  </div>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                    {typeof result.data === 'string' 
                      ? result.data 
                      : JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}