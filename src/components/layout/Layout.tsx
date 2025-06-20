'use client';

import { useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { useAuth } from '@/stores/auth';

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export function Layout({ children, showFooter = true }: LayoutProps) {
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}