'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, Clock, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VotingButtons } from '@/components/voting/VotingButtons';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ideasService } from '@/lib/api';
import type { IdeaResponse } from '@/types';
import Link from 'next/link';

// Mock data
const mockIdeas: IdeaResponse[] = [
  {
    id: 1,
    title: "Implement AI-Powered Code Review",
    description: "Integrate machine learning to automatically review code and suggest improvements, reducing manual review time and catching common issues.",
    category: "innovation",
    tags: ["ai", "development", "automation"],
    status: "active",
    user_id: "user_001",
    user_email: "alice@techcorp.com",
    user_name: "Alice Johnson",
    vote_count: 23,
    average_rating: 4.2,
    view_count: 156,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: null,
    published_at: "2024-01-15T10:30:00Z",
    comments_count: 8
  },
  {
    id: 2,
    title: "Flexible Working Hours Policy",
    description: "Allow employees to choose their working hours within core business hours to improve work-life balance and productivity.",
    category: "improvement",
    tags: ["hr", "policy", "work-life-balance"],
    status: "active",
    user_id: "user_002",
    user_email: "bob@techcorp.com",
    user_name: "Bob Smith",
    vote_count: 18,
    average_rating: 3.8,
    view_count: 89,
    created_at: "2024-01-14T14:20:00Z",
    updated_at: null,
    published_at: "2024-01-14T14:20:00Z",
    comments_count: 5
  },
  {
    id: 3,
    title: "Customer Feedback Integration System",
    description: "Create a unified system to collect, analyze, and act on customer feedback from multiple channels including social media, support tickets, and surveys.",
    category: "revenue_generation",
    tags: ["customer", "feedback", "integration"],
    status: "active",
    user_id: "user_003",
    user_email: "carol@techcorp.com",
    user_name: "Carol Davis",
    vote_count: 15,
    average_rating: 4.5,
    view_count: 67,
    created_at: "2024-01-13T09:15:00Z",
    updated_at: null,
    published_at: "2024-01-13T09:15:00Z",
    comments_count: 3
  }
];

const categoryLabels = {
  innovation: "Innovation",
  improvement: "Improvement", 
  problem_solving: "Problem Solving",
  cost_saving: "Cost Saving",
  revenue_generation: "Revenue Generation",
  other: "Other"
};

const sortOptions = [
  { value: 'trending', label: 'Trending' },
  { value: 'recent', label: 'Most Recent' },
  { value: 'votes', label: 'Most Votes' },
  { value: 'rating', label: 'Highest Rated' },
];

function VotingContent() {
  const [ideas, setIdeas] = useState<IdeaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('trending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      try {
        const filters = {
          sort_by: sortBy === 'trending' ? 'created_at' : sortBy === 'votes' ? 'vote_count' : sortBy === 'rating' ? 'average_rating' : 'created_at',
          order: 'desc' as const,
          search: searchTerm || undefined,
          category: selectedCategory !== 'all' ? selectedCategory as any : undefined,
        };

        const response = await ideasService.getIdeas(filters);
        let fetchedIdeas = response.items || response as any;

        // Apply client-side sorting for trending if needed
        if (sortBy === 'trending') {
          fetchedIdeas.sort((a: IdeaResponse, b: IdeaResponse) => 
            (b.vote_count + b.view_count) - (a.vote_count + a.view_count)
          );
        }

        setIdeas(fetchedIdeas);
      } catch (error) {
        console.error('Error fetching ideas:', error);
        // Fallback to mock data if backend is not available
        let sortedIdeas = [...mockIdeas];
        
        // Apply sorting
        switch (sortBy) {
          case 'votes':
            sortedIdeas.sort((a, b) => b.vote_count - a.vote_count);
            break;
          case 'rating':
            sortedIdeas.sort((a, b) => b.average_rating - a.average_rating);
            break;
          case 'recent':
            sortedIdeas.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            break;
          case 'trending':
          default:
            sortedIdeas.sort((a, b) => (b.vote_count + b.view_count) - (a.vote_count + a.view_count));
            break;
        }

        // Apply filters
        if (searchTerm) {
          sortedIdeas = sortedIdeas.filter(idea => 
            idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            idea.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        if (selectedCategory !== 'all') {
          sortedIdeas = sortedIdeas.filter(idea => idea.category === selectedCategory);
        }

        setIdeas(sortedIdeas);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, [sortBy, searchTerm, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ideas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vote on Ideas</h1>
        <p className="text-gray-600">
          Help prioritize the best ideas by voting and rating them
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes Cast</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Ideas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ideas.length}</div>
            <p className="text-xs text-muted-foreground">Ideas awaiting votes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Rated</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">★ 4.2</div>
            <p className="text-xs text-muted-foreground">Average rating this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search ideas to vote on..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Ideas List */}
      <div className="space-y-6">
        {ideas.map((idea) => (
          <Card key={idea.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary">
                      {categoryLabels[idea.category]}
                    </Badge>
                    {idea.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="text-xl mb-2">
                    <Link href={`/ideas/${idea.id}`} className="hover:text-blue-600">
                      {idea.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-base mb-4">
                    {idea.description}
                  </CardDescription>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>by {idea.user_name}</span>
                    <span>{new Date(idea.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                {/* Voting Section */}
                <div className="lg:ml-8">
                  <VotingButtons 
                    ideaId={idea.id}
                    size="md"
                    showRating={true}
                  />
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {ideas.length === 0 && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No ideas found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters to find ideas to vote on.
            </p>
            <Link href="/ideas">
              <Button>Browse All Ideas</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VotingPage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <VotingContent />
    </ProtectedRoute>
  );
}