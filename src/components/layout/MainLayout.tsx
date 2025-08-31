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


        {/* Dynamic Page Content */}
        <main className="p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
