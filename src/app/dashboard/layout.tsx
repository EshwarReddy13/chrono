'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const [isNavbarMinimized, setIsNavbarMinimized] = useState(false);

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border border-[rgba(189,189,189,0.4)] rounded-xl p-8 shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFFF00] mx-auto"></div>
          <p className="text-white text-center mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null; // Will redirect to /login
  }

  return (
    <div className="min-h-screen">
      <Navbar 
        currentPage="dashboard" 
        onMinimizeChange={setIsNavbarMinimized}
      />
      <div className={`transition-all duration-300 ${isNavbarMinimized ? 'pl-16' : 'pl-64'}`}>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
