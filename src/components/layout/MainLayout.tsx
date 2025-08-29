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
  const { currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [isNavbarMinimized, setIsNavbarMinimized] = useState(false);

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
        {/* Page Header */}
        <header className="bg-[rgba(33,33,33,0.9)] backdrop-blur-[16px] border-b border-[rgba(189,189,189,0.2)]">
          <div className="flex items-center justify-between h-16 px-6">
            <div>
              <h1 className="text-xl font-semibold text-white capitalize">
                {currentPage}
              </h1>
            </div>
            
            {/* Notifications */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.1)] rounded-lg transition-colors duration-200">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M9 11h.01M9 8h.01" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
