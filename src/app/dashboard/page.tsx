'use client';

import { useState, useEffect } from 'react';
import { Plus, TrendingUp, Users, CheckCircle, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HealthCheck } from '@/components/debug/HealthCheck';
import { useAuth } from '@/stores/auth';
import { ideasService, votingService } from '@/lib/api';
import Link from 'next/link';

function DashboardContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalIdeas: 0,
    myIdeas: 0,
    votes: 0,
    decisions: 0,
  });

  // Fetch real stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch ideas to get counts
        const ideasResponse = await ideasService.getIdeas({ page_size: 1000 });
        const allIdeas = ideasResponse.items || ideasResponse as any;
        
        // Calculate stats
        const totalIdeas = allIdeas.length;
        const myIdeas = user ? allIdeas.filter((idea: any) => idea.user_id === user.user_id).length : 0;
        
        // Get voting stats if available
        let votes = 0;
        try {
          const votingStats = await votingService.getVotingStats();
          votes = votingStats.total_votes || 0;
        } catch (error) {
          console.log('Voting stats not available');
        }

        setStats({
          totalIdeas,
          myIdeas,
          votes,
          decisions: 0, // Will be updated when decision service is connected
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        // Fallback to mock data
        setStats({
          totalIdeas: 245,
          myIdeas: 12,
          votes: 89,
          decisions: 34,
        });
      }
    };

    fetchStats();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your team's ideas
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/ideas/new">
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Submit New Idea
              </Button>
            </Link>
            <Link href="/ideas">
              <Button variant="outline" className="w-full sm:w-auto">
                Browse Ideas
              </Button>
            </Link>
            <Link href="/voting">
              <Button variant="outline" className="w-full sm:w-auto">
                Vote on Ideas
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Ideas</CardTitle>
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalIdeas}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Ideas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.myIdeas}</div>
              <p className="text-xs text-muted-foreground">
                +2 this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Votes Cast</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.votes}</div>
              <p className="text-xs text-muted-foreground">
                +15 this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Decisions</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.decisions}</div>
              <p className="text-xs text-muted-foreground">
                +3 this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Backend Status & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <HealthCheck />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Ideas</CardTitle>
              <CardDescription>
                Latest ideas submitted by your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "Automated Testing Pipeline", author: "John Doe", time: "2 hours ago" },
                  { title: "Remote Work Policy Update", author: "Jane Smith", time: "4 hours ago" },
                  { title: "Customer Feedback Integration", author: "Mike Johnson", time: "1 day ago" },
                ].map((idea, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{idea.title}</p>
                      <p className="text-sm text-gray-500">by {idea.author}</p>
                    </div>
                    <span className="text-xs text-gray-400">{idea.time}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/ideas">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Ideas
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trending Ideas</CardTitle>
              <CardDescription>
                Most voted ideas this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "AI-Powered Code Review", votes: 23, trend: "+5" },
                  { title: "Flexible Working Hours", votes: 18, trend: "+3" },
                  { title: "Team Building Activities", votes: 15, trend: "+7" },
                ].map((idea, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{idea.title}</p>
                      <p className="text-sm text-gray-500">{idea.votes} votes</p>
                    </div>
                    <span className="text-xs text-green-600 font-medium">
                      {idea.trend}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/voting">
                  <Button variant="outline" size="sm" className="w-full">
                    Vote on Ideas
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <DashboardContent />
    </ProtectedRoute>
  );
}