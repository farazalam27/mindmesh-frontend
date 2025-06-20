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

// Ideas Service API
export const ideasService = {
  // Get all ideas with optional filters
  getIdeas: async (filters?: IdeaFilters): Promise<PaginatedResponse<IdeaResponse>> => {
    const response = await ideasApi.get('/api/v1/ideas/', { params: filters });
    return response.data;
  },

  // Get a specific idea by ID
  getIdea: async (id: number): Promise<IdeaResponse> => {
    const response = await ideasApi.get(`/api/v1/ideas/${id}`);
    return response.data;
  },

  // Create a new idea
  createIdea: async (data: IdeaCreate): Promise<IdeaResponse> => {
    const response = await ideasApi.post('/api/v1/ideas/', data);
    return response.data;
  },

  // Update an existing idea
  updateIdea: async (id: number, data: IdeaUpdate): Promise<IdeaResponse> => {
    const response = await ideasApi.put(`/api/v1/ideas/${id}`, data);
    return response.data;
  },

  // Delete an idea
  deleteIdea: async (id: number): Promise<void> => {
    await ideasApi.delete(`/api/v1/ideas/${id}`);
  },

  // Get comments for an idea
  getComments: async (ideaId: number): Promise<CommentResponse[]> => {
    const response = await ideasApi.get(`/api/v1/ideas/${ideaId}/comments`);
    return response.data;
  },

  // Add a comment to an idea
  addComment: async (data: CommentCreate): Promise<CommentResponse> => {
    const response = await ideasApi.post('/api/v1/comments/', data);
    return response.data;
  },
};

// Voting Service API
export const votingService = {
  // Cast a vote
  castVote: async (data: VoteCreate): Promise<VoteResponse> => {
    const response = await votingApi.post('/api/v1/votes/', data);
    return response.data;
  },

  // Remove a vote
  removeVote: async (ideaId: number): Promise<void> => {
    await votingApi.delete(`/api/v1/votes/${ideaId}`);
  },

  // Get vote aggregates for an idea
  getVoteAggregates: async (ideaId: number): Promise<VoteAggregateResponse> => {
    const response = await votingApi.get(`/api/v1/votes/idea/${ideaId}/aggregate`);
    return response.data;
  },

  // Get voting statistics
  getVotingStats: async (): Promise<any> => {
    const response = await votingApi.get('/api/v1/votes/stats');
    return response.data;
  },

  // Get user's votes
  getUserVotes: async (): Promise<VoteResponse[]> => {
    const response = await votingApi.get('/api/v1/votes/user');
    return response.data;
  },
};

// Decision Service API
export const decisionService = {
  // Get all decisions
  getDecisions: async (filters?: any): Promise<PaginatedResponse<DecisionResponse>> => {
    const response = await decisionApi.get('/api/v1/decisions/', { params: filters });
    return response.data;
  },

  // Get a specific decision by ID
  getDecision: async (id: number): Promise<DecisionResponse> => {
    const response = await decisionApi.get(`/api/v1/decisions/${id}`);
    return response.data;
  },

  // Create a new decision
  createDecision: async (data: DecisionCreate): Promise<DecisionResponse> => {
    const response = await decisionApi.post('/api/v1/decisions/', data);
    return response.data;
  },

  // Update a decision
  updateDecision: async (id: number, data: DecisionUpdate): Promise<DecisionResponse> => {
    const response = await decisionApi.put(`/api/v1/decisions/${id}`, data);
    return response.data;
  },

  // Get decisions for a specific idea
  getDecisionsByIdea: async (ideaId: number): Promise<DecisionResponse[]> => {
    const response = await decisionApi.get(`/api/v1/decisions/idea/${ideaId}`);
    return response.data;
  },
};

// Health check functions
export const healthChecks = {
  checkIdeasService: async (): Promise<boolean> => {
    try {
      await ideasApi.get('/health');
      return true;
    } catch {
      return false;
    }
  },

  checkVotingService: async (): Promise<boolean> => {
    try {
      await votingApi.get('/health');
      return true;
    } catch {
      return false;
    }
  },

  checkDecisionService: async (): Promise<boolean> => {
    try {
      await decisionApi.get('/health');
      return true;
    } catch {
      return false;
    }
  },

  checkAllServices: async (): Promise<{ ideas: boolean; voting: boolean; decision: boolean }> => {
    const [ideas, voting, decision] = await Promise.all([
      healthChecks.checkIdeasService(),
      healthChecks.checkVotingService(),
      healthChecks.checkDecisionService(),
    ]);

    return { ideas, voting, decision };
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