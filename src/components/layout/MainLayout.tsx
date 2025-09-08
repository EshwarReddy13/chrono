'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from './Navbar';
import Dashboard from '@/components/dashboard/Dashboard';
import Timer from '@/components/timer/Timer';
import Projects from '@/components/projects/Projects';
import Reports from '@/components/reports/Reports';
import Settings from '@/components/settings/Settings';

type PageType = 'dashboard' | 'timer' | 'projects' | 'reports' | 'settings';

export default function MainLayout() {
  const { currentUser, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [isNavbarMinimized, setIsNavbarMinimized] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Listen for navbar state changes
  useEffect(() => {
    const handleNavbarToggle = (event: CustomEvent) => {
      setIsNavbarMinimized(event.detail.isMinimized);
    };

    window.addEventListener('navbar-toggle', handleNavbarToggle as EventListener);
    
    return () => {
      window.removeEventListener('navbar-toggle', handleNavbarToggle as EventListener);
    };
  }, []);

  // Listen for navigation changes
  useEffect(() => {
    const handleNavigation = (event: CustomEvent) => {
      setCurrentPage(event.detail.page as PageType);
    };

    window.addEventListener('navigate-to', handleNavigation as EventListener);
    
    return () => {
      window.removeEventListener('navigate-to', handleNavigation as EventListener);
    };
  }, []);

  // Listen for logout confirmation
  useEffect(() => {
    const handleLogoutClick = () => {
      console.log('Logout click event received in MainLayout');
      setShowLogoutConfirm(true);
    };

    console.log('Adding logout-click event listener');
    window.addEventListener('logout-click', handleLogoutClick as EventListener);
    
    return () => {
      console.log('Removing logout-click event listener');
      window.removeEventListener('logout-click', handleLogoutClick as EventListener);
    };
  }, []);

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

  if (!currentUser) {
    return null;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'timer':
        return <Timer />;
      case 'projects':
        return <Projects />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <Navbar currentPage={currentPage} />

      {/* Main content with dynamic padding */}
      <div 
        className={`transition-all duration-300 ${
          isNavbarMinimized ? 'pl-16' : 'pl-64'
        }`}
      >


        {/* Dynamic Page Content */}
        <main className="p-6">
          {renderPage()}
        </main>
      </div>

      {/* Logout Confirmation Popup */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
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
