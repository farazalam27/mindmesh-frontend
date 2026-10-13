// Mock data for MindMesh frontend

export interface MockUser {
  id: string;
  username: string;
  email: string;
  role: 'facilitator' | 'member' | 'decision_maker' | 'observer';
}

export interface MockIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  author_id: string;
  author_username?: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  comment_count: number;
  vote_stats?: {
    total_votes: number;
    average_rating: number;
    upvotes: number;
    downvotes: number;
  };
}

export interface MockVote {
  id: string;
  idea_id: string;
  user_id: string;
  vote_type: 'upvote' | 'downvote';
  rating: number;
  created_at: string;
}

export interface MockComment {
  id: string;
  idea_id: string;
  user_id: string;
  username?: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface MockDecision {
  id: string;
  idea_id: string;
  decision_type: 'implementation' | 'rejection' | 'modification' | 'postponement';
  rationale: string;
  decision_maker_id: string;
  decision_maker_username?: string;
  created_at: string;
  implementation_timeline?: string;
  budget_allocated?: number;
}

// Mock Users
export const mockUsers: MockUser[] = [
  {
    id: '1',
    username: 'john_facilitator',
    email: 'john@mindmesh.com',
    role: 'facilitator'
  },
  {
    id: '2', 
    username: 'sarah_member',
    email: 'sarah@mindmesh.com',
    role: 'member'
  },
  {
    id: '3',
    username: 'mike_decision',
    email: 'mike@mindmesh.com',
    role: 'decision_maker'
  },
  {
    id: '4',
    username: 'lisa_observer',
    email: 'lisa@mindmesh.com',
    role: 'observer'
  },
  {
    id: '5',
    username: 'alex_member',
    email: 'alex@mindmesh.com',
    role: 'member'
  }
];

// Mock Ideas
export const mockIdeas: MockIdea[] = [
  {
    id: '1',
    title: 'AI-Powered Code Review Assistant',
    description: 'Develop an AI assistant that can automatically review code commits, suggest improvements, and identify potential bugs before they reach production. This would integrate with our existing Git workflow and provide instant feedback to developers.',
    category: 'Technology',
    status: 'published',
    tags: ['AI', 'Development', 'Automation', 'Code Quality'],
    author_id: '2',
    author_username: 'sarah_member',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    view_count: 127,
    comment_count: 8
  },
  {
    id: '2',
    title: 'Remote Team Building Virtual Reality Experience',
    description: 'Create immersive VR experiences for remote team building activities. This could include virtual escape rooms, collaborative puzzle solving, and team challenges that help distributed teams bond and work together more effectively.',
    category: 'HR',
    status: 'published',
    tags: ['VR', 'Team Building', 'Remote Work', 'Innovation'],
    author_id: '5',
    author_username: 'alex_member',
    created_at: '2024-01-14T14:20:00Z',
    updated_at: '2024-01-14T14:20:00Z',
    view_count: 89,
    comment_count: 5
  },
  {
    id: '3',
    title: 'Sustainable Office Energy Management System',
    description: 'Implement an IoT-based energy management system that monitors and optimizes office energy consumption. Include smart lighting, HVAC controls, and real-time energy usage dashboards to reduce our carbon footprint by 30%.',
    category: 'Sustainability',
    status: 'published',
    tags: ['IoT', 'Energy', 'Sustainability', 'Cost Savings'],
    author_id: '1',
    author_username: 'john_facilitator',
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-13T09:15:00Z',
    view_count: 156,
    comment_count: 12
  },
  {
    id: '4',
    title: 'Customer Feedback Loop Automation',
    description: 'Automate the collection and analysis of customer feedback across all touchpoints. This system would use NLP to categorize feedback, identify trends, and automatically route issues to the appropriate teams for resolution.',
    category: 'Customer Experience',
    status: 'published',
    tags: ['Automation', 'NLP', 'Customer Service', 'Analytics'],
    author_id: '2',
    author_username: 'sarah_member',
    created_at: '2024-01-12T16:45:00Z',
    updated_at: '2024-01-12T16:45:00Z',
    view_count: 94,
    comment_count: 6
  },
  {
    id: '5',
    title: 'Blockchain-Based Supply Chain Transparency',
    description: 'Develop a blockchain solution to track products through our entire supply chain, providing complete transparency to customers about sourcing, manufacturing, and delivery. This would help build trust and support our sustainability goals.',
    category: 'Technology',
    status: 'published',
    tags: ['Blockchain', 'Supply Chain', 'Transparency', 'Trust'],
    author_id: '5',
    author_username: 'alex_member',
    created_at: '2024-01-11T11:30:00Z',
    updated_at: '2024-01-11T11:30:00Z',
    view_count: 203,
    comment_count: 15
  },
  {
    id: '6',
    title: 'Employee Wellness Mental Health Platform',
    description: 'Create a comprehensive mental health platform for employees featuring AI-powered mood tracking, personalized wellness recommendations, virtual therapy sessions, and anonymous peer support groups.',
    category: 'HR',
    status: 'published',
    tags: ['Mental Health', 'Employee Wellness', 'AI', 'Support'],
    author_id: '1',
    author_username: 'john_facilitator',
    created_at: '2024-01-10T13:20:00Z',
    updated_at: '2024-01-10T13:20:00Z',
    view_count: 178,
    comment_count: 9
  },
  {
    id: '7',
    title: 'Dynamic Pricing Optimization Engine',
    description: 'Build an ML-powered dynamic pricing engine that adjusts prices in real-time based on demand, competition, inventory levels, and market conditions to maximize revenue while maintaining competitiveness.',
    category: 'Business Strategy',
    status: 'draft',
    tags: ['Machine Learning', 'Pricing', 'Revenue Optimization', 'Competition'],
    author_id: '3',
    author_username: 'mike_decision',
    created_at: '2024-01-09T08:45:00Z',
    updated_at: '2024-01-09T08:45:00Z',
    view_count: 45,
    comment_count: 2
  }
];

// Mock Votes
export const mockVotes: MockVote[] = [
  // Votes for AI Code Review Assistant
  { id: '1', idea_id: '1', user_id: '1', vote_type: 'upvote', rating: 5, created_at: '2024-01-15T11:00:00Z' },
  { id: '2', idea_id: '1', user_id: '3', vote_type: 'upvote', rating: 4, created_at: '2024-01-15T12:00:00Z' },
  { id: '3', idea_id: '1', user_id: '4', vote_type: 'upvote', rating: 5, created_at: '2024-01-15T13:00:00Z' },
  { id: '4', idea_id: '1', user_id: '5', vote_type: 'upvote', rating: 4, created_at: '2024-01-15T14:00:00Z' },
  
  // Votes for VR Team Building
  { id: '5', idea_id: '2', user_id: '1', vote_type: 'upvote', rating: 3, created_at: '2024-01-14T15:00:00Z' },
  { id: '6', idea_id: '2', user_id: '2', vote_type: 'upvote', rating: 4, created_at: '2024-01-14T16:00:00Z' },
  { id: '7', idea_id: '2', user_id: '3', vote_type: 'downvote', rating: 2, created_at: '2024-01-14T17:00:00Z' },
  
  // Votes for Energy Management
  { id: '8', idea_id: '3', user_id: '2', vote_type: 'upvote', rating: 5, created_at: '2024-01-13T10:00:00Z' },
  { id: '9', idea_id: '3', user_id: '3', vote_type: 'upvote', rating: 5, created_at: '2024-01-13T11:00:00Z' },
  { id: '10', idea_id: '3', user_id: '4', vote_type: 'upvote', rating: 4, created_at: '2024-01-13T12:00:00Z' },
  { id: '11', idea_id: '3', user_id: '5', vote_type: 'upvote', rating: 5, created_at: '2024-01-13T13:00:00Z' },
  
  // Votes for Customer Feedback
  { id: '12', idea_id: '4', user_id: '1', vote_type: 'upvote', rating: 4, created_at: '2024-01-12T17:00:00Z' },
  { id: '13', idea_id: '4', user_id: '3', vote_type: 'upvote', rating: 3, created_at: '2024-01-12T18:00:00Z' },
  { id: '14', idea_id: '4', user_id: '5', vote_type: 'upvote', rating: 4, created_at: '2024-01-12T19:00:00Z' },
  
  // Votes for Blockchain Supply Chain
  { id: '15', idea_id: '5', user_id: '1', vote_type: 'upvote', rating: 5, created_at: '2024-01-11T12:00:00Z' },
  { id: '16', idea_id: '5', user_id: '2', vote_type: 'upvote', rating: 4, created_at: '2024-01-11T13:00:00Z' },
  { id: '17', idea_id: '5', user_id: '3', vote_type: 'upvote', rating: 5, created_at: '2024-01-11T14:00:00Z' },
  { id: '18', idea_id: '5', user_id: '4', vote_type: 'downvote', rating: 2, created_at: '2024-01-11T15:00:00Z' },
  
  // Votes for Mental Health Platform
  { id: '19', idea_id: '6', user_id: '2', vote_type: 'upvote', rating: 5, created_at: '2024-01-10T14:00:00Z' },
  { id: '20', idea_id: '6', user_id: '3', vote_type: 'upvote', rating: 4, created_at: '2024-01-10T15:00:00Z' },
  { id: '21', idea_id: '6', user_id: '4', vote_type: 'upvote', rating: 5, created_at: '2024-01-10T16:00:00Z' },
  { id: '22', idea_id: '6', user_id: '5', vote_type: 'upvote', rating: 4, created_at: '2024-01-10T17:00:00Z' },
];

// Mock Comments
export const mockComments: MockComment[] = [
  {
    id: '1',
    idea_id: '1',
    user_id: '1',
    username: 'john_facilitator',
    content: 'This is exactly what our development team needs! The AI assistant could save hours of manual code review time.',
    created_at: '2024-01-15T11:30:00Z',
    updated_at: '2024-01-15T11:30:00Z'
  },
  {
    id: '2',
    idea_id: '1',
    user_id: '3',
    username: 'mike_decision',
    content: 'What about the cost of implementation? Do we have estimates for the AI infrastructure required?',
    created_at: '2024-01-15T12:30:00Z',
    updated_at: '2024-01-15T12:30:00Z'
  },
  {
    id: '3',
    idea_id: '1',
    user_id: '2',
    username: 'sarah_member',
    content: 'We could start with a pilot program on one repository to test effectiveness before full rollout.',
    created_at: '2024-01-15T13:30:00Z',
    updated_at: '2024-01-15T13:30:00Z'
  },
  {
    id: '4',
    idea_id: '2',
    user_id: '1',
    username: 'john_facilitator',
    content: 'VR team building sounds innovative, but we need to consider the cost of VR equipment for all remote employees.',
    created_at: '2024-01-14T15:30:00Z',
    updated_at: '2024-01-14T15:30:00Z'
  },
  {
    id: '5',
    idea_id: '2',
    user_id: '2',
    username: 'sarah_member',
    content: 'Maybe we could partner with a VR company or start with web-based 3D experiences that don\'t require special equipment?',
    created_at: '2024-01-14T16:30:00Z',
    updated_at: '2024-01-14T16:30:00Z'
  },
  {
    id: '6',
    idea_id: '3',
    user_id: '2',
    username: 'sarah_member',
    content: 'The energy management system aligns perfectly with our sustainability goals. The ROI calculations look promising.',
    created_at: '2024-01-13T10:30:00Z',
    updated_at: '2024-01-13T10:30:00Z'
  },
  {
    id: '7',
    idea_id: '3',
    user_id: '3',
    username: 'mike_decision',
    content: 'I love the 30% reduction target. Can we get a detailed timeline and budget breakdown for implementation?',
    created_at: '2024-01-13T11:30:00Z',
    updated_at: '2024-01-13T11:30:00Z'
  },
  {
    id: '8',
    idea_id: '5',
    user_id: '1',
    username: 'john_facilitator',
    content: 'Blockchain for supply chain is cutting-edge, but we need to ensure our suppliers can integrate with the system.',
    created_at: '2024-01-11T13:30:00Z',
    updated_at: '2024-01-11T13:30:00Z'
  },
  {
    id: '9',
    idea_id: '6',
    user_id: '2',
    username: 'sarah_member',
    content: 'Mental health support is crucial for employee retention. The anonymous peer support feature is particularly valuable.',
    created_at: '2024-01-10T14:30:00Z',
    updated_at: '2024-01-10T14:30:00Z'
  }
];

// Mock Decisions
export const mockDecisions: MockDecision[] = [
  {
    id: '1',
    idea_id: '3',
    decision_type: 'implementation',
    rationale: 'The energy management system shows strong ROI potential and aligns with our sustainability commitments. The 30% reduction target is achievable and will significantly reduce operational costs.',
    decision_maker_id: '3',
    decision_maker_username: 'mike_decision',
    created_at: '2024-01-16T09:00:00Z',
    implementation_timeline: 'Q2 2024 - Q4 2024',
    budget_allocated: 150000
  },
  {
    id: '2',
    idea_id: '1',
    decision_type: 'implementation',
    rationale: 'AI-powered code review will improve code quality and developer productivity. Starting with a pilot program to validate effectiveness before full deployment.',
    decision_maker_id: '3',
    decision_maker_username: 'mike_decision',
    created_at: '2024-01-16T10:00:00Z',
    implementation_timeline: 'Q1 2024 - Q2 2024 (Pilot)',
    budget_allocated: 75000
  },
  {
    id: '3',
    idea_id: '2',
    decision_type: 'modification',
    rationale: 'VR team building is interesting but expensive. Modifying to start with web-based 3D experiences that don\'t require VR hardware investment.',
    decision_maker_id: '3',
    decision_maker_username: 'mike_decision',
    created_at: '2024-01-16T11:00:00Z',
    implementation_timeline: 'Q3 2024',
    budget_allocated: 25000
  },
  {
    id: '4',
    idea_id: '6',
    decision_type: 'implementation',
    rationale: 'Employee mental health is a priority. This platform will help improve employee satisfaction and retention while demonstrating our commitment to wellbeing.',
    decision_maker_id: '3',
    decision_maker_username: 'mike_decision',
    created_at: '2024-01-16T12:00:00Z',
    implementation_timeline: 'Q2 2024 - Q3 2024',
    budget_allocated: 100000
  }
];

// Helper function to calculate vote statistics
export function calculateVoteStats(ideaId: string): {
  total_votes: number;
  average_rating: number;
  upvotes: number;
  downvotes: number;
} {
  const ideaVotes = mockVotes.filter(vote => vote.idea_id === ideaId);
  
  if (ideaVotes.length === 0) {
    return { total_votes: 0, average_rating: 0, upvotes: 0, downvotes: 0 };
  }
  
  const upvotes = ideaVotes.filter(vote => vote.vote_type === 'upvote').length;
  const downvotes = ideaVotes.filter(vote => vote.vote_type === 'downvote').length;
  const totalRating = ideaVotes.reduce((sum, vote) => sum + vote.rating, 0);
  const averageRating = totalRating / ideaVotes.length;
  
  return {
    total_votes: ideaVotes.length,
    average_rating: Math.round(averageRating * 10) / 10,
    upvotes,
    downvotes
  };
}

// Add vote stats to mock ideas
export const mockIdeasWithStats = mockIdeas.map(idea => ({
  ...idea,
  vote_stats: calculateVoteStats(idea.id)
}));

// Current user (for authentication simulation)
export const currentUser: MockUser = mockUsers[1]; // sarah_member

// Categories for filtering
export const categories = [
  'Technology',
  'HR', 
  'Sustainability',
  'Customer Experience',
  'Business Strategy',
  'Marketing',
  'Operations',
  'Finance'
];

// Tags for filtering
export const allTags = Array.from(
  new Set(mockIdeas.flatMap(idea => idea.tags))
).sort();