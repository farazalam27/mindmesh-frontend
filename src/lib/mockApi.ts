// Mock API implementation for MindMesh frontend
import { 
  mockIdeasWithStats, 
  mockVotes, 
  mockComments, 
  mockDecisions, 
  mockUsers,
  currentUser,
  categories,
  allTags,
  calculateVoteStats,
  type MockIdea,
  type MockVote,
  type MockComment,
  type MockDecision,
  type MockUser
} from '../data/mockData';

// In-memory storage for session (resets on page reload)
let sessionIdeas = [...mockIdeasWithStats];
let sessionVotes = [...mockVotes];
let sessionComments = [...mockComments];
let sessionDecisions = [...mockDecisions];
let sessionUsers = [...mockUsers];

// Simulate network delay
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

// Generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock Authentication API
export const mockAuthApi = {
  async login(username: string, password: string) {
    await delay(300);
    
    const user = sessionUsers.find(u => u.username === username);
    if (!user) {
      throw new Error('Invalid username or password');
    }
    
    // In a real app, you'd validate the password
    return {
      user,
      token: `mock_token_${user.id}`,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  },

  async getCurrentUser() {
    await delay(100);
    return currentUser;
  },

  async logout() {
    await delay(100);
    return { success: true };
  }
};

// Mock Ideas API
export const mockIdeasApi = {
  async getIdeas(params?: {
    category?: string;
    status?: string;
    search?: string;
    tags?: string[];
    page?: number;
    limit?: number;
  }) {
    await delay(250);
    
    let filteredIdeas = [...sessionIdeas];
    
    // Apply filters
    if (params?.category && params.category !== 'all') {
      filteredIdeas = filteredIdeas.filter(idea => idea.category === params.category);
    }
    
    if (params?.status && params.status !== 'all') {
      filteredIdeas = filteredIdeas.filter(idea => idea.status === params.status);
    }
    
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredIdeas = filteredIdeas.filter(idea => 
        idea.title.toLowerCase().includes(searchLower) ||
        idea.description.toLowerCase().includes(searchLower) ||
        idea.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    if (params?.tags && params.tags.length > 0) {
      filteredIdeas = filteredIdeas.filter(idea =>
        params.tags!.some(tag => idea.tags.includes(tag))
      );
    }
    
    // Pagination
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedIdeas = filteredIdeas.slice(startIndex, endIndex);
    
    return {
      ideas: paginatedIdeas,
      total: filteredIdeas.length,
      page,
      limit,
      pages: Math.ceil(filteredIdeas.length / limit)
    };
  },

  async getIdea(id: string) {
    await delay(150);
    
    const idea = sessionIdeas.find(i => i.id === id);
    if (!idea) {
      throw new Error('Idea not found');
    }
    
    // Increment view count
    idea.view_count += 1;
    
    return idea;
  },

  async createIdea(ideaData: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    status?: string;
  }) {
    await delay(300);
    
    const newIdea: MockIdea = {
      id: generateId(),
      title: ideaData.title,
      description: ideaData.description,
      category: ideaData.category,
      status: (ideaData.status as any) || 'draft',
      tags: ideaData.tags,
      author_id: currentUser.id,
      author_username: currentUser.username,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      view_count: 0,
      comment_count: 0,
      vote_stats: { total_votes: 0, average_rating: 0, upvotes: 0, downvotes: 0 }
    };
    
    sessionIdeas.unshift(newIdea);
    return newIdea;
  },

  async updateIdea(id: string, updates: Partial<MockIdea>) {
    await delay(250);
    
    const ideaIndex = sessionIdeas.findIndex(i => i.id === id);
    if (ideaIndex === -1) {
      throw new Error('Idea not found');
    }
    
    sessionIdeas[ideaIndex] = {
      ...sessionIdeas[ideaIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    return sessionIdeas[ideaIndex];
  },

  async deleteIdea(id: string) {
    await delay(200);
    
    const ideaIndex = sessionIdeas.findIndex(i => i.id === id);
    if (ideaIndex === -1) {
      throw new Error('Idea not found');
    }
    
    sessionIdeas.splice(ideaIndex, 1);
    
    // Also remove related votes and comments
    sessionVotes = sessionVotes.filter(v => v.idea_id !== id);
    sessionComments = sessionComments.filter(c => c.idea_id !== id);
    sessionDecisions = sessionDecisions.filter(d => d.idea_id !== id);
    
    return { success: true };
  },

  async getCategories() {
    await delay(50);
    return categories;
  },

  async getTags() {
    await delay(50);
    return allTags;
  }
};

// Mock Voting API
export const mockVotingApi = {
  async getVotes(ideaId: string) {
    await delay(100);
    
    const votes = sessionVotes.filter(v => v.idea_id === ideaId);
    return votes;
  },

  async getUserVote(ideaId: string, userId: string = currentUser.id) {
    await delay(100);
    
    const vote = sessionVotes.find(v => v.idea_id === ideaId && v.user_id === userId);
    return vote || null;
  },

  async castVote(voteData: {
    idea_id: string;
    vote_type: 'upvote' | 'downvote';
    rating: number;
  }) {
    await delay(200);
    
    // Remove existing vote from same user
    sessionVotes = sessionVotes.filter(v => 
      !(v.idea_id === voteData.idea_id && v.user_id === currentUser.id)
    );
    
    // Add new vote
    const newVote: MockVote = {
      id: generateId(),
      idea_id: voteData.idea_id,
      user_id: currentUser.id,
      vote_type: voteData.vote_type,
      rating: voteData.rating,
      created_at: new Date().toISOString()
    };
    
    sessionVotes.push(newVote);
    
    // Update idea vote stats
    const ideaIndex = sessionIdeas.findIndex(i => i.id === voteData.idea_id);
    if (ideaIndex !== -1) {
      sessionIdeas[ideaIndex].vote_stats = calculateVoteStats(voteData.idea_id);
    }
    
    return newVote;
  },

  async removeVote(ideaId: string, userId: string = currentUser.id) {
    await delay(150);
    
    const voteIndex = sessionVotes.findIndex(v => v.idea_id === ideaId && v.user_id === userId);
    if (voteIndex === -1) {
      throw new Error('Vote not found');
    }
    
    sessionVotes.splice(voteIndex, 1);
    
    // Update idea vote stats
    const ideaIndex = sessionIdeas.findIndex(i => i.id === ideaId);
    if (ideaIndex !== -1) {
      sessionIdeas[ideaIndex].vote_stats = calculateVoteStats(ideaId);
    }
    
    return { success: true };
  },

  async getVoteStats(ideaId: string) {
    await delay(50);
    return calculateVoteStats(ideaId);
  }
};

// Mock Comments API
export const mockCommentsApi = {
  async getComments(ideaId: string) {
    await delay(150);
    
    const comments = sessionComments
      .filter(c => c.idea_id === ideaId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    
    return comments;
  },

  async createComment(commentData: {
    idea_id: string;
    content: string;
  }) {
    await delay(250);
    
    const newComment: MockComment = {
      id: generateId(),
      idea_id: commentData.idea_id,
      user_id: currentUser.id,
      username: currentUser.username,
      content: commentData.content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    sessionComments.push(newComment);
    
    // Update idea comment count
    const ideaIndex = sessionIdeas.findIndex(i => i.id === commentData.idea_id);
    if (ideaIndex !== -1) {
      sessionIdeas[ideaIndex].comment_count += 1;
    }
    
    return newComment;
  },

  async updateComment(id: string, content: string) {
    await delay(200);
    
    const commentIndex = sessionComments.findIndex(c => c.id === id);
    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }
    
    sessionComments[commentIndex] = {
      ...sessionComments[commentIndex],
      content,
      updated_at: new Date().toISOString()
    };
    
    return sessionComments[commentIndex];
  },

  async deleteComment(id: string) {
    await delay(150);
    
    const commentIndex = sessionComments.findIndex(c => c.id === id);
    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }
    
    const comment = sessionComments[commentIndex];
    sessionComments.splice(commentIndex, 1);
    
    // Update idea comment count
    const ideaIndex = sessionIdeas.findIndex(i => i.id === comment.idea_id);
    if (ideaIndex !== -1) {
      sessionIdeas[ideaIndex].comment_count -= 1;
    }
    
    return { success: true };
  }
};

// Mock Decisions API
export const mockDecisionsApi = {
  async getDecisions(ideaId?: string) {
    await delay(150);
    
    let decisions = [...sessionDecisions];
    
    if (ideaId) {
      decisions = decisions.filter(d => d.idea_id === ideaId);
    }
    
    return decisions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async createDecision(decisionData: {
    idea_id: string;
    decision_type: 'implementation' | 'rejection' | 'modification' | 'postponement';
    rationale: string;
    implementation_timeline?: string;
    budget_allocated?: number;
  }) {
    await delay(300);
    
    const newDecision: MockDecision = {
      id: generateId(),
      idea_id: decisionData.idea_id,
      decision_type: decisionData.decision_type,
      rationale: decisionData.rationale,
      decision_maker_id: currentUser.id,
      decision_maker_username: currentUser.username,
      created_at: new Date().toISOString(),
      implementation_timeline: decisionData.implementation_timeline,
      budget_allocated: decisionData.budget_allocated
    };
    
    sessionDecisions.push(newDecision);
    return newDecision;
  },

  async updateDecision(id: string, updates: Partial<MockDecision>) {
    await delay(250);
    
    const decisionIndex = sessionDecisions.findIndex(d => d.id === id);
    if (decisionIndex === -1) {
      throw new Error('Decision not found');
    }
    
    sessionDecisions[decisionIndex] = {
      ...sessionDecisions[decisionIndex],
      ...updates
    };
    
    return sessionDecisions[decisionIndex];
  },

  async deleteDecision(id: string) {
    await delay(150);
    
    const decisionIndex = sessionDecisions.findIndex(d => d.id === id);
    if (decisionIndex === -1) {
      throw new Error('Decision not found');
    }
    
    sessionDecisions.splice(decisionIndex, 1);
    return { success: true };
  }
};

// Mock Analytics API
export const mockAnalyticsApi = {
  async getOverviewStats() {
    await delay(200);
    
    const totalIdeas = sessionIdeas.length;
    const publishedIdeas = sessionIdeas.filter(i => i.status === 'published').length;
    const totalVotes = sessionVotes.length;
    const totalComments = sessionComments.length;
    const totalDecisions = sessionDecisions.length;
    
    return {
      total_ideas: totalIdeas,
      published_ideas: publishedIdeas,
      draft_ideas: sessionIdeas.filter(i => i.status === 'draft').length,
      total_votes: totalVotes,
      total_comments: totalComments,
      total_decisions: totalDecisions,
      active_users: sessionUsers.length,
      top_categories: this.getTopCategories(),
      recent_activity: this.getRecentActivity()
    };
  },

  async getTopCategories() {
    await delay(100);
    
    const categoryCounts = sessionIdeas.reduce((acc, idea) => {
      acc[idea.category] = (acc[idea.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  },

  async getRecentActivity() {
    await delay(100);
    
    const activities = [
      ...sessionIdeas.map(i => ({ type: 'idea', data: i, timestamp: i.created_at })),
      ...sessionVotes.map(v => ({ type: 'vote', data: v, timestamp: v.created_at })),
      ...sessionComments.map(c => ({ type: 'comment', data: c, timestamp: c.created_at })),
      ...sessionDecisions.map(d => ({ type: 'decision', data: d, timestamp: d.created_at }))
    ];
    
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  },

  async getVotingTrends(days: number = 7) {
    await delay(150);
    
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
    
    const votesInRange = sessionVotes.filter(v => {
      const voteDate = new Date(v.created_at);
      return voteDate >= startDate && voteDate <= endDate;
    });
    
    // Group by date
    const trendData = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const votesOnDate = votesInRange.filter(v => v.created_at.startsWith(dateStr));
      
      trendData.push({
        date: dateStr,
        votes: votesOnDate.length,
        upvotes: votesOnDate.filter(v => v.vote_type === 'upvote').length,
        downvotes: votesOnDate.filter(v => v.vote_type === 'downvote').length
      });
    }
    
    return trendData;
  }
};

// Health check endpoint
export const mockHealthApi = {
  async getHealth() {
    await delay(50);
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      mode: 'mock',
      services: {
        ideas: 'healthy',
        voting: 'healthy',
        comments: 'healthy',
        decisions: 'healthy',
        analytics: 'healthy'
      }
    };
  }
};

// Reset function for testing
export const resetMockData = () => {
  sessionIdeas = [...mockIdeasWithStats];
  sessionVotes = [...mockVotes];
  sessionComments = [...mockComments];
  sessionDecisions = [...mockDecisions];
  sessionUsers = [...mockUsers];
};