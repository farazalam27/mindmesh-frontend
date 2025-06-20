'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/stores/auth';

interface UseAuthGuardOptions {
  requireAuth?: boolean;
  requiredRoles?: string[];
  redirectTo?: string;
}

export function useAuthGuard({
  requireAuth = true,
  requiredRoles = [],
  redirectTo = '/login',
}: UseAuthGuardOptions = {}) {
  const { isAuthenticated, user, checkAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Redirect if authentication is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // Redirect if user doesn't have required roles
    if (requiredRoles.length > 0 && user) {
      const hasRequiredRole = requiredRoles.some(role => user.roles.includes(role));
      if (!hasRequiredRole) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [isAuthenticated, user, requireAuth, requiredRoles, router, redirectTo]);

  const isAuthorized = () => {
    if (requireAuth && !isAuthenticated) return false;
    if (requiredRoles.length > 0 && user) {
      return requiredRoles.some(role => user.roles.includes(role));
    }
    return true;
  };

  const isLoading = requireAuth && !isAuthenticated;

  return {
    isAuthenticated,
    user,
    isAuthorized: isAuthorized(),
    isLoading,
  };
}

// Convenience hooks for specific roles
export function useAdminGuard() {
  return useAuthGuard({
    requireAuth: true,
    requiredRoles: ['admin'],
  });
}

export function useDecisionMakerGuard() {
  return useAuthGuard({
    requireAuth: true,
    requiredRoles: ['decision_maker', 'facilitator', 'admin'],
  });
}

export function useFacilitatorGuard() {
  return useAuthGuard({
    requireAuth: true,
    requiredRoles: ['facilitator', 'admin'],
  });
}