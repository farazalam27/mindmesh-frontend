'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, Eye, ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/stores/auth';
import { ideasService } from '@/lib/api';
import type { IdeaResponse, IdeaFilters } from '@/types';

// Mock data for now - replace with real API calls
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

const statusLabels = {
  draft: "Draft",
  active: "Active",
  implemented: "Implemented",
  rejected: "Rejected"
};

export default function IdeasPage() {
  const { isAuthenticated } = useAuth();
  const [ideas, setIdeas] = useState<IdeaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<IdeaFilters>({
    page: 1,
    page_size: 10,
    sort_by: "created_at",
    order: "desc"
  });

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      try {
        const response = await ideasService.getIdeas(filters);
        setIdeas(response.items || response as any); // Handle both paginated and direct array responses
      } catch (error) {
        console.error('Error fetching ideas:', error);
        // Fallback to mock data if backend is not available
        setIdeas(mockIdeas);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, [filters]);

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  const handleCategoryFilter = (category: string) => {
    setFilters(prev => ({ 
      ...prev, 
      category: category === "all" ? undefined : category as any,
      page: 1 
    }));
  };

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({ 
      ...prev, 
      status: status === "all" ? undefined : status as any,
      page: 1 
    }));
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ideas</h1>
          <p className="text-gray-600">Discover and contribute to innovative ideas</p>
        </div>
        {isAuthenticated && (
          <Link href="/ideas/new">
            <Button className="mt-4 sm:mt-0">
              <Plus className="mr-2 h-4 w-4" />
              Submit Idea
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search ideas..."
                className="pl-10"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <Select onValueChange={handleCategoryFilter}>
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

          {/* Status Filter */}
          <Select onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.entries(statusLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas.map((idea) => (
          <Card key={idea.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2 line-clamp-2">
                    <Link href={`/ideas/${idea.id}`} className="hover:text-blue-600">
                      {idea.title}
                    </Link>
                  </CardTitle>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary">
                      {categoryLabels[idea.category]}
                    </Badge>
                    <Badge 
                      variant={idea.status === 'active' ? 'default' : 'outline'}
                    >
                      {statusLabels[idea.status]}
                    </Badge>
                  </div>
                </div>
              </div>
              <CardDescription className="line-clamp-3">
                {idea.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {idea.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>by {idea.user_name}</span>
                <span>{new Date(idea.created_at).toLocaleDateString()}</span>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {idea.vote_count}
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {idea.view_count}
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {idea.comments_count}
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium">
                    ★ {idea.average_rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {ideas.length === 0 && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No ideas found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters, or be the first to submit an idea!
            </p>
            {isAuthenticated && (
              <Link href="/ideas/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Submit First Idea
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}