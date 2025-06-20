import jwt from 'jsonwebtoken';
import type { JWTPayload, User } from '@/types';

export const JWT_SECRET = 'your-super-secret-key-here-for-development';

export const decodeJWT = (token: string): JWTPayload | null => {
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

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJWT(token);
  if (!decoded) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

export const getTokenFromStorage = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('jwt_token');
};

export const getUserFromStorage = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const clearAuthStorage = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('user');
};

// Create a real JWT token for testing (using the sample users from the context)
export const createTestToken = (user: User): string => {
  const payload: JWTPayload = {
    ...user,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours
  };

  // Create real JWT token using the same secret as backend
  return jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256' });
};

// Validate user roles
export const validateUserRole = (userRoles: string[], requiredRoles: string[]): boolean => {
  return requiredRoles.some(role => userRoles.includes(role));
};

// Role hierarchy check
export const hasPermission = (userRoles: string[], permission: string): boolean => {
  const permissions = {
    'view_ideas': ['member', 'facilitator', 'decision_maker', 'admin'],
    'create_ideas': ['member', 'facilitator', 'decision_maker', 'admin'],
    'edit_ideas': ['member', 'facilitator', 'decision_maker', 'admin'],
    'delete_ideas': ['facilitator', 'admin'],
    'vote': ['member', 'facilitator', 'decision_maker', 'admin'],
    'create_decisions': ['decision_maker', 'facilitator', 'admin'],
    'edit_decisions': ['decision_maker', 'facilitator', 'admin'],
    'view_analytics': ['facilitator', 'decision_maker', 'admin'],
    'admin_functions': ['admin'],
  };

  const requiredRoles = permissions[permission as keyof typeof permissions];
  if (!requiredRoles) return false;

  return validateUserRole(userRoles, requiredRoles);
};