'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Lightbulb, 
  Vote, 
  CheckCircle, 
  BarChart3, 
  Users,
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/stores/auth';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { hasRole, canCreateDecisions } = useAuth();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: pathname === '/dashboard',
    },
    {
      name: 'Ideas',
      href: '/ideas',
      icon: Lightbulb,
      current: pathname.startsWith('/ideas'),
    },
    {
      name: 'Voting',
      href: '/voting',
      icon: Vote,
      current: pathname.startsWith('/voting'),
    },
    {
      name: 'Decisions',
      href: '/decisions',
      icon: CheckCircle,
      current: pathname.startsWith('/decisions'),
      requiresAuth: true,
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      current: pathname.startsWith('/analytics'),
      requiresRole: ['facilitator', 'admin'],
    },
  ];

  const adminNavigation = [
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
      current: pathname.startsWith('/admin/users'),
      requiresRole: ['admin'],
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      current: pathname.startsWith('/admin/settings'),
      requiresRole: ['admin'],
    },
  ];

  const shouldShowItem = (item: any) => {
    if (item.requiresRole) {
      return item.requiresRole.some((role: string) => hasRole(role));
    }
    return true;
  };

  return (
    <div className={cn('flex flex-col w-64 bg-white shadow-sm', className)}>
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            if (!shouldShowItem(item)) return null;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  item.current
                    ? 'bg-blue-50 border-r-4 border-blue-600 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                )}
              >
                <item.icon
                  className={cn(
                    item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500',
                    'mr-3 flex-shrink-0 h-6 w-6'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
          
          {/* Admin Section */}
          {hasRole('admin') && (
            <div className="mt-8">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Administration
              </h3>
              <div className="mt-2 space-y-1">
                {adminNavigation.map((item) => {
                  if (!shouldShowItem(item)) return null;
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        item.current
                          ? 'bg-blue-50 border-r-4 border-blue-600 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                      )}
                    >
                      <item.icon
                        className={cn(
                          item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500',
                          'mr-3 flex-shrink-0 h-6 w-6'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}