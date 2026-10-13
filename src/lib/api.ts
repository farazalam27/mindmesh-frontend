import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  IdeaResponse,
  IdeaCreate,
  IdeaUpdate,
  IdeaFilters,
  PaginatedResponse,
  VoteCreate,
  VoteResponse,
  VoteAggregateResponse,
  DecisionCreate,
  DecisionUpdate,
  DecisionResponse,
  CommentCreate,
  CommentResponse,
} from '@/types';

// Import mock services
import {
  mockAuthApi,
  mockIdeasApi,
  mockVotingApi,
  mockCommentsApi,
  mockDecisionsApi,
  mockAnalyticsApi,
  mockHealthApi,
} from './mockApi';

// Check if we should use mock mode
const API_MODE = process.env.NEXT_PUBLIC_API_MODE || 'mock';
const useMockMode = API_MODE === 'mock';

console.log(`🔧 API Mode: ${API_MODE}${useMockMode ? ' (using mock data)' : ' (using real backend)'}`);

// Create axios instances for each service
const createApiInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add JWT token
  instance.interceptors.request.use(
    (config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('jwt_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response) => {
      console.log(`✅ API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
      return response;
    },
    (error: AxiosError) => {
      console.error(`❌ API Error: ${error.response?.status} ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data);
      
      if (error.response?.status === 401) {
        // Token expired or invalid
        console.warn('🚨 401 Unauthorized - redirecting to login');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// API instances
const ideasApi = createApiInstance(process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001');
const votingApi = createApiInstance(process.env.NEXT_PUBLIC_VOTING_API_URL || 'http://localhost:8002');
const decisionApi = createApiInstance(process.env.NEXT_PUBLIC_DECISION_API_URL || 'http://localhost:8003');

// Authentication Service API
export const authService = {
  login: async (username: string, password: string) => {
    if (useMockMode) {
      return mockAuthApi.login(username, password);
    }
    const response = await ideasApi.post('/api/v1/auth/login', { username, password });
    return response.data;
  },

  getCurrentUser: async () => {
    if (useMockMode) {
      return mockAuthApi.getCurrentUser();
    }
    const response = await ideasApi.get('/api/v1/auth/me');
    return response.data;
  },

  logout: async () => {
    if (useMockMode) {
      return mockAuthApi.logout();
    }
    const response = await ideasApi.post('/api/v1/auth/logout');
    return response.data;
  },
};

// Ideas Service API
export const ideasService = {
  // Get all ideas with optional filters
  getIdeas: async (filters?: any) => {
    if (useMockMode) {
      return mockIdeasApi.getIdeas(filters);
    }
    const response = await ideasApi.get('/api/v1/ideas/', { params: filters });
    return response.data;
  },

  // Get a specific idea by ID
  getIdea: async (id: string) => {
    if (useMockMode) {
      return mockIdeasApi.getIdea(id);
    }
    const response = await ideasApi.get(`/api/v1/ideas/${id}`);
    return response.data;
  },

  // Create a new idea
  createIdea: async (data: any) => {
    if (useMockMode) {
      return mockIdeasApi.createIdea(data);
    }
    const response = await ideasApi.post('/api/v1/ideas/', data);
    return response.data;
  },

  // Update an existing idea
  updateIdea: async (id: string, data: any) => {
    if (useMockMode) {
      return mockIdeasApi.updateIdea(id, data);
    }
    const response = await ideasApi.put(`/api/v1/ideas/${id}`, data);
    return response.data;
  },

  // Delete an idea
  deleteIdea: async (id: string) => {
    if (useMockMode) {
      return mockIdeasApi.deleteIdea(id);
    }
    await ideasApi.delete(`/api/v1/ideas/${id}`);
  },

  // Get categories
  getCategories: async () => {
    if (useMockMode) {
      return mockIdeasApi.getCategories();
    }
    const response = await ideasApi.get('/api/v1/ideas/categories');
    return response.data;
  },

  // Get tags
  getTags: async () => {
    if (useMockMode) {
      return mockIdeasApi.getTags();
    }
    const response = await ideasApi.get('/api/v1/ideas/tags');
    return response.data;
  },
};

// Voting Service API
export const votingService = {
  // Get votes for an idea
  getVotes: async (ideaId: string) => {
    if (useMockMode) {
      return mockVotingApi.getVotes(ideaId);
    }
    const response = await votingApi.get(`/api/v1/votes/idea/${ideaId}`);
    return response.data;
  },

  // Get user's vote for an idea
  getUserVote: async (ideaId: string, userId?: string) => {
    if (useMockMode) {
      return mockVotingApi.getUserVote(ideaId, userId);
    }
    const response = await votingApi.get(`/api/v1/votes/idea/${ideaId}/user/${userId || 'me'}`);
    return response.data;
  },

  // Cast a vote
  castVote: async (data: any) => {
    if (useMockMode) {
      return mockVotingApi.castVote(data);
    }
    const response = await votingApi.post('/api/v1/votes/', data);
    return response.data;
  },

  // Remove a vote
  removeVote: async (ideaId: string, userId?: string) => {
    if (useMockMode) {
      return mockVotingApi.removeVote(ideaId, userId);
    }
    await votingApi.delete(`/api/v1/votes/idea/${ideaId}/user/${userId || 'me'}`);
  },

  // Get vote statistics for an idea
  getVoteStats: async (ideaId: string) => {
    if (useMockMode) {
      return mockVotingApi.getVoteStats(ideaId);
    }
    const response = await votingApi.get(`/api/v1/votes/idea/${ideaId}/stats`);
    return response.data;
  },
};

// Comments Service API  
export const commentsService = {
  // Get comments for an idea
  getComments: async (ideaId: string) => {
    if (useMockMode) {
      return mockCommentsApi.getComments(ideaId);
    }
    const response = await ideasApi.get(`/api/v1/ideas/${ideaId}/comments`);
    return response.data;
  },

  // Create a comment
  createComment: async (data: any) => {
    if (useMockMode) {
      return mockCommentsApi.createComment(data);
    }
    const response = await ideasApi.post('/api/v1/comments/', data);
    return response.data;
  },

  // Update a comment
  updateComment: async (id: string, content: string) => {
    if (useMockMode) {
      return mockCommentsApi.updateComment(id, content);
    }
    const response = await ideasApi.put(`/api/v1/comments/${id}`, { content });
    return response.data;
  },

  // Delete a comment
  deleteComment: async (id: string) => {
    if (useMockMode) {
      return mockCommentsApi.deleteComment(id);
    }
    await ideasApi.delete(`/api/v1/comments/${id}`);
  },
};

// Decision Service API
export const decisionService = {
  // Get all decisions
  getDecisions: async (ideaId?: string) => {
    if (useMockMode) {
      return mockDecisionsApi.getDecisions(ideaId);
    }
    const params = ideaId ? { idea_id: ideaId } : {};
    const response = await decisionApi.get('/api/v1/decisions/', { params });
    return response.data;
  },

  // Create a new decision
  createDecision: async (data: any) => {
    if (useMockMode) {
      return mockDecisionsApi.createDecision(data);
    }
    const response = await decisionApi.post('/api/v1/decisions/', data);
    return response.data;
  },

  // Update a decision
  updateDecision: async (id: string, data: any) => {
    if (useMockMode) {
      return mockDecisionsApi.updateDecision(id, data);
    }
    const response = await decisionApi.put(`/api/v1/decisions/${id}`, data);
    return response.data;
  },

  // Delete a decision
  deleteDecision: async (id: string) => {
    if (useMockMode) {
      return mockDecisionsApi.deleteDecision(id);
    }
    await decisionApi.delete(`/api/v1/decisions/${id}`);
  },
};

// Analytics Service API
export const analyticsService = {
  // Get overview statistics
  getOverviewStats: async () => {
    if (useMockMode) {
      return mockAnalyticsApi.getOverviewStats();
    }
    const response = await ideasApi.get('/api/v1/analytics/overview');
    return response.data;
  },

  // Get top categories
  getTopCategories: async () => {
    if (useMockMode) {
      return mockAnalyticsApi.getTopCategories();
    }
    const response = await ideasApi.get('/api/v1/analytics/categories');
    return response.data;
  },

  // Get recent activity
  getRecentActivity: async () => {
    if (useMockMode) {
      return mockAnalyticsApi.getRecentActivity();
    }
    const response = await ideasApi.get('/api/v1/analytics/activity');
    return response.data;
  },

  // Get voting trends
  getVotingTrends: async (days: number = 7) => {
    if (useMockMode) {
      return mockAnalyticsApi.getVotingTrends(days);
    }
    const response = await votingApi.get('/api/v1/analytics/trends', { params: { days } });
    return response.data;
  },
};

// Health check functions
export const healthChecks = {
  getHealth: async () => {
    if (useMockMode) {
      return mockHealthApi.getHealth();
    }
    try {
      const response = await ideasApi.get('/health');
      return response.data;
    } catch (error) {
      console.warn('Health check failed, falling back to mock mode');
      return mockHealthApi.getHealth();
    }
  },
};

// Generic API error handler
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Export default instance for custom requests
export const api = {
  ideas: ideasApi,
  voting: votingApi,
  decision: decisionApi,
};