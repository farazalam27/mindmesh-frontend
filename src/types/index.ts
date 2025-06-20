// User and Authentication Types
export interface User {
  user_id: string;
  email: string;
  name: string;
  roles: string[];
}

export interface JWTPayload extends User {
  exp: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

// Idea Types
export type IdeaCategory = 
  | 'innovation' 
  | 'improvement' 
  | 'problem_solving' 
  | 'cost_saving' 
  | 'revenue_generation' 
  | 'other';

export type IdeaStatus = 
  | 'draft' 
  | 'active' 
  | 'implemented' 
  | 'rejected';

export interface IdeaCreate {
  title: string;
  description: string;
  category: IdeaCategory;
  tags: string[];
}

export interface IdeaUpdate {
  title?: string;
  description?: string;
  category?: IdeaCategory;
  tags?: string[];
  status?: IdeaStatus;
}

export interface IdeaResponse {
  id: number;
  title: string;
  description: string;
  category: IdeaCategory;
  tags: string[];
  status: IdeaStatus;
  user_id: string;
  user_email: string;
  user_name: string;
  vote_count: number;
  average_rating: number;
  view_count: number;
  created_at: string;
  updated_at: string | null;
  published_at: string | null;
  comments_count: number;
}

export interface IdeaFilters {
  page?: number;
  page_size?: number;
  sort_by?: string;
  order?: 'asc' | 'desc';
  category?: IdeaCategory;
  status?: IdeaStatus;
  search?: string;
}

// Comment Types
export interface CommentCreate {
  content: string;
  idea_id: number;
}

export interface CommentResponse {
  id: number;
  idea_id: number;
  content: string;
  user_id: string;
  user_email: string;
  user_name: string;
  created_at: string;
}

// Voting Types
export type VoteType = 'upvote' | 'downvote';

export interface VoteCreate {
  idea_id: number;
  vote_type: VoteType;
  rating?: number; // 1-5 scale
}

export interface VoteResponse {
  id: number;
  idea_id: number;
  user_id: string;
  vote_type: VoteType;
  rating: number | null;
  created_at: string;
}

export interface VoteAggregateResponse {
  idea_id: number;
  upvote_count: number;
  downvote_count: number;
  total_votes: number;
  rating_count: number;
  average_rating: number;
  score: number;
  last_updated: string;
}

// Decision Types
export type DecisionType = 
  | 'implementation' 
  | 'rejection' 
  | 'modification' 
  | 'escalation' 
  | 'deferral';

export type DecisionStatus = 
  | 'pending' 
  | 'in_review' 
  | 'approved' 
  | 'rejected' 
  | 'implemented' 
  | 'on_hold';

export interface DecisionCreate {
  idea_id: number;
  decision_type: DecisionType;
  summary: string; // 10-500 chars
  rationale: string; // min 20 chars
  conditions?: string[];
  timeline_days?: number;
}

export interface DecisionUpdate {
  status?: DecisionStatus;
  summary?: string;
  rationale?: string;
  conditions?: string[];
  timeline_days?: number;
}

export interface DecisionResponse {
  id: number;
  decision_id: string; // UUID
  idea_id: number;
  decision_type: DecisionType;
  status: DecisionStatus;
  summary: string;
  rationale: string;
  conditions: string[];
  timeline_days: number | null;
  decided_by: string;
  decision_committee: string[];
  created_at: string;
  decided_at: string | null;
  implemented_at: string | null;
  events_count: number;
}

// API Response Types
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ApiError {
  message: string;
  details?: any;
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

// Form Types
export interface IdeaFormData {
  title: string;
  description: string;
  category: IdeaCategory;
  tags: string;
}

export interface DecisionFormData {
  decision_type: DecisionType;
  summary: string;
  rationale: string;
  conditions: string;
  timeline_days: string;
}

// Analytics Types
export interface AnalyticsData {
  ideas_by_category: Record<IdeaCategory, number>;
  ideas_by_status: Record<IdeaStatus, number>;
  voting_trends: Array<{
    date: string;
    votes: number;
  }>;
  user_engagement: {
    total_users: number;
    active_users: number;
    ideas_created: number;
    votes_cast: number;
  };
  decision_success_rates: Record<DecisionType, number>;
}