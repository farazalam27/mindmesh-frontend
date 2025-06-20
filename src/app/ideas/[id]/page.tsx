'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2, Eye, Calendar, User, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/stores/auth';
import { ideasService } from '@/lib/api';
import type { IdeaResponse, CommentResponse } from '@/types';

// Mock data
const mockIdea: IdeaResponse = {
  id: 1,
  title: "Implement AI-Powered Code Review",
  description: "Integrate machine learning to automatically review code and suggest improvements, reducing manual review time and catching common issues.\n\nThis system would analyze code patterns, detect potential bugs, suggest optimizations, and ensure coding standards compliance. It could integrate with our existing CI/CD pipeline and provide real-time feedback to developers.\n\nKey benefits:\n- Reduce manual review time by 40%\n- Catch bugs early in development\n- Improve code quality and consistency\n- Help junior developers learn best practices",
  category: "innovation",
  tags: ["ai", "development", "automation", "ci-cd"],
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
};

const mockComments: CommentResponse[] = [
  {
    id: 1,
    idea_id: 1,
    content: "This is a fantastic idea! We could start with a pilot on one of our smaller projects.",
    user_id: "user_002",
    user_email: "bob@techcorp.com",
    user_name: "Bob Smith",
    created_at: "2024-01-15T14:30:00Z"
  },
  {
    id: 2,
    idea_id: 1,
    content: "Have you considered which AI model would be best for this? I think we should look into CodeT5 or similar transformer models.",
    user_id: "user_003",
    user_email: "carol@techcorp.com",
    user_name: "Carol Davis",
    created_at: "2024-01-16T09:15:00Z"
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

export default function IdeaDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const [idea, setIdea] = useState<IdeaResponse | null>(null);
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdeaDetails = async () => {
      if (!params.id) return;
      
      setLoading(true);
      try {
        const ideaId = parseInt(params.id as string);
        const [ideaResponse, commentsResponse] = await Promise.all([
          ideasService.getIdea(ideaId),
          ideasService.getComments(ideaId).catch(() => []) // Comments might not be implemented yet
        ]);
        
        setIdea(ideaResponse);
        setComments(commentsResponse);
      } catch (error) {
        console.error('Error fetching idea details:', error);
        // Fallback to mock data if backend is not available
        setIdea(mockIdea);
        setComments(mockComments);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeaDetails();
  }, [params.id]);

  const isOwner = idea && user && idea.user_id === user.user_id;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading idea...</p>
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Idea not found</h1>
          <p className="text-gray-600 mb-4">The idea you're looking for doesn't exist.</p>
          <Link href="/ideas">
            <Button>Back to Ideas</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Link href="/ideas">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Ideas
            </Button>
          </Link>
          {isOwner && (
            <div className="flex space-x-2">
              <Link href={`/ideas/${idea.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">
                  {categoryLabels[idea.category]}
                </Badge>
                <Badge variant={idea.status === 'active' ? 'default' : 'outline'}>
                  {statusLabels[idea.status]}
                </Badge>
              </div>
              <CardTitle className="text-2xl mb-4">{idea.title}</CardTitle>
              <div className="flex flex-wrap gap-1 mb-4">
                {idea.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {idea.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 last:mb-0 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="mr-2 h-5 w-5" />
                Comments ({comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id}>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {comment.user_name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">{comment.user_name}</span>
                          <span className="text-gray-500 text-sm">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                    {comment.id !== comments[comments.length - 1].id && (
                      <Separator className="mt-6" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Idea Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Votes</span>
                  <span className="font-medium">{idea.vote_count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Average Rating</span>
                  <span className="font-medium">★ {idea.average_rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Views</span>
                  <span className="font-medium">{idea.view_count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Comments</span>
                  <span className="font-medium">{idea.comments_count}</span>
                </div>
              </CardContent>
            </Card>

            {/* Author Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Author</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {idea.user_name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{idea.user_name}</p>
                    <p className="text-sm text-gray-500">{idea.user_email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metadata Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Created:</span>
                  <span className="ml-1">{new Date(idea.created_at).toLocaleDateString()}</span>
                </div>
                {idea.updated_at && (
                  <div className="flex items-center text-sm">
                    <Edit className="mr-2 h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Updated:</span>
                    <span className="ml-1">{new Date(idea.updated_at).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex items-center text-sm">
                  <Eye className="mr-2 h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Status:</span>
                  <span className="ml-1">{statusLabels[idea.status]}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}