import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createTestToken } from '@/utils/auth';
import type { User, LoginCredentials, RegisterData, JWTPayload } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  setToken: (token: string) => void;
  clearError: () => void;
  checkAuth: () => void;
}

// JWT decode function (simple implementation)
const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

// Check if token is expired
const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJWT(token);
  if (!decoded) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          // Use predefined test users with proper JWT tokens
          // These match the sample users from the backend context
          const testUsers = {
            'alice@techcorp.com': {
              user_id: 'user_001',
              email: 'alice@techcorp.com',
              name: 'Alice Johnson',
              roles: ['facilitator', 'admin'],
            },
            'bob@techcorp.com': {
              user_id: 'user_002',
              email: 'bob@techcorp.com',
              name: 'Bob Smith',
              roles: ['member'],
            },
            'carol@techcorp.com': {
              user_id: 'user_003',
              email: 'carol@techcorp.com',
              name: 'Carol Davis',
              roles: ['decision_maker'],
            },
          };

          const user = testUsers[credentials.email as keyof typeof testUsers];
          if (!user || credentials.password !== 'password') {
            throw new Error('Invalid credentials');
          }

          // Create real JWT token using the same secret as backend
          const token = createTestToken(user);

          // Store token in localStorage
          localStorage.setItem('jwt_token', token);
          localStorage.setItem('user', JSON.stringify(user));

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Mock registration - in real app, this would call backend API
          const newUser: User = {
            user_id: `user_${Date.now()}`,
            email: data.email,
            name: data.name,
            roles: ['member'],
          };

          const token = createTestToken(newUser);

          localStorage.setItem('jwt_token', token);
          localStorage.setItem('user', JSON.stringify(newUser));

          set({
            user: newUser,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Registration failed',
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setToken: (token: string) => {
        const decoded = decodeJWT(token);
        if (!decoded || isTokenExpired(token)) {
          get().logout();
          return;
        }

        const user: User = {
          user_id: decoded.user_id,
          email: decoded.email,
          name: decoded.name,
          roles: decoded.roles,
        };

        localStorage.setItem('jwt_token', token);
        localStorage.setItem('user', JSON.stringify(user));

        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: () => {
        if (typeof window === 'undefined') return;

        const token = localStorage.getItem('jwt_token');
        const userStr = localStorage.getItem('user');

        if (!token || !userStr) {
          get().logout();
          return;
        }

        if (isTokenExpired(token)) {
          get().logout();
          return;
        }

        try {
          const user = JSON.parse(userStr);
          set({
            user,
            token,
            isAuthenticated: true,
          });
        } catch {
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Helper hook for role-based access
export const useAuth = () => {
  const auth = useAuthStore();
  
  const hasRole = (role: string): boolean => {
    return auth.user?.roles.includes(role) ?? false;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some(role => hasRole(role));
  };

  const canCreateDecisions = (): boolean => {
    return hasAnyRole(['decision_maker', 'facilitator', 'admin']);
  };

  const canEditIdeas = (): boolean => {
    return auth.isAuthenticated; // All authenticated users can edit their own ideas
  };

  const canVote = (): boolean => {
    return auth.isAuthenticated; // All authenticated users can vote
  };

  return {
    ...auth,
    hasRole,
    hasAnyRole,
    canCreateDecisions,
    canEditIdeas,
    canVote,
  };
};