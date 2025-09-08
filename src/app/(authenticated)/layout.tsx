'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isNavbarMinimized, setIsNavbarMinimized] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Determine current page from pathname
  const getCurrentPage = () => {
    if (pathname === '/dashboard') return 'dashboard';
    
    // Extract the first segment of the path (e.g., "projects" from "/projects/123")
    const segments = pathname.split('/').filter(Boolean);
    return segments[0] || 'dashboard';
  };

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, loading, router]);

  // Listen for logout confirmation
  useEffect(() => {
    const handleLogoutClick = () => {
      console.log('Logout click event received in AuthenticatedLayout');
      setShowLogoutConfirm(true);
    };

    console.log('Adding logout-click event listener');
    window.addEventListener('logout-click', handleLogoutClick as EventListener);
    
    // Test popup visibility
    console.log('showLogoutConfirm state:', showLogoutConfirm);
    
    return () => {
      console.log('Removing logout-click event listener');
      window.removeEventListener('logout-click', handleLogoutClick as EventListener);
    };
  }, [showLogoutConfirm]);

  const handleLogout = async () => {
    try {
      await logout();
      setShowLogoutConfirm(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

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
        currentPage={getCurrentPage()} 
        onMinimizeChange={setIsNavbarMinimized}
      />
      <div className={`transition-all duration-300 ${isNavbarMinimized ? 'pl-16' : 'pl-64'}`}>
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Logout Confirmation Popup */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          {/* Blurred Background */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCancelLogout}
          />
          
          {/* Glassmorphism Popup */}
          <div className="relative backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/20 mb-4">
                <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h3 className="text-lg font-medium text-white mb-2">
                Sign Out
              </h3>
              
              <p className="text-sm text-gray-300 mb-6">
                Are you sure you want to sign out? Any unsaved changes will be lost.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleCancelLogout}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-300 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors duration-200"
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500/80 border border-red-400/50 rounded-lg hover:bg-red-500 transition-colors duration-200"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
