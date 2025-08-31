'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface NavbarProps {
  currentPage: string;
}

export default function Navbar({ currentPage }: NavbarProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleMinimized = () => {
    const newState = !isMinimized;
    setIsMinimized(newState);
    
    // Emit custom event for layout wrapper
    window.dispatchEvent(new CustomEvent('navbar-toggle', {
      detail: { isMinimized: newState }
    }));
  };
  
  const { currentUser, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', page: 'dashboard', icon: '📊' },
    { name: 'Timer', page: 'timer', icon: '⏱️' },
    { name: 'Projects', page: 'projects', icon: '📁' },
    { name: 'Reports', page: 'reports', icon: '📈' },
    { name: 'Settings', page: 'settings', icon: '⚙️' },
  ];

  const handleNavigation = (page: string) => {
    window.dispatchEvent(new CustomEvent('navigate-to', {
      detail: { page }
    }));
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!currentUser) {
    return null; // Don't show navbar for unauthenticated users
  }

  return (
    <nav className={`fixed top-0 left-0 h-full bg-[rgba(33,33,33,0.95)] backdrop-blur-[16px] border-r border-[rgba(189,189,189,0.2)] transition-all duration-300 ease-in-out z-50 flex flex-col ${
      isMinimized ? 'w-16' : 'w-64'
    }`}>
      {/* Toggle Button */}
      <button
        onClick={toggleMinimized}
        className="absolute -right-3 top-8 bg-[#F4D03F] text-gray-900 p-1 rounded-full shadow-lg hover:bg-[#F7DC6F] transition-colors duration-200 transform hover:scale-110"
        aria-label={isMinimized ? 'Expand sidebar' : 'Minimize sidebar'}
      >
        <svg 
          className={`w-4 h-4 transition-transform duration-300 ${isMinimized ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Logo Section - Fixed at top */}
      <div className="flex items-center h-16 px-6 border-b border-[rgba(189,189,189,0.2)] flex-shrink-0">
        {isMinimized ? (
                     <div className="w-8 h-8 bg-[#F4D03F] rounded-lg flex items-center justify-center mx-auto">
             <span className="text-lg font-bold text-gray-900">C</span>
           </div>
        ) : (
                     <h1 className="text-2xl font-bold text-[#F4D03F]">Chrono</h1>
        )}
      </div>

      {/* Navigation Section - Takes remaining space */}
      <div className={`flex-1 overflow-y-auto ${
        isMinimized ? 'px-2 py-4' : 'px-4 py-6'
      } space-y-2`}>
        {navigation.map((item) => {
          const isActive = currentPage === item.page;
          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.page)}
              className={`flex items-center w-full text-sm font-medium rounded-lg transition-colors duration-200 group relative ${
                isMinimized 
                  ? 'px-2 py-2 justify-center' 
                  : 'px-3 py-2'
              } ${
                isActive
                  ? 'bg-[#F4D03F] text-gray-900'
                  : 'text-gray-300 hover:bg-[rgba(255,255,255,0.1)] hover:text-white'
              }`}
              title={isMinimized ? item.name : undefined}
            >
              {isMinimized ? (
                // Centered icon for minimized state
                <span className="text-lg">{item.icon}</span>
              ) : (
                // Normal layout for expanded state
                <>
                  <span className="text-lg">{item.icon}</span>
                  <span className="ml-3">{item.name}</span>
                </>
              )}
              
              {/* Tooltip for minimized state */}
              {isMinimized && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* User Section - Fixed at bottom */}
      <div className={`border-t border-[rgba(189,189,189,0.2)] flex-shrink-0 ${
        isMinimized ? 'p-2' : 'p-4'
      }`}>
        {isMinimized ? (
          <div className="space-y-2">
            {/* User Avatar - Centered */}
            <div className="flex justify-center">
              <div className="h-8 w-8 rounded-full bg-[#F4D03F] flex items-center justify-center">
                <span className="text-sm font-medium text-gray-900">
                  {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
            
            {/* Logout Button - Centered */}
            <div className="flex justify-center">
              <button
                onClick={handleLogout}
                className="w-8 h-8 bg-[rgba(255,255,255,0.1)] rounded-lg flex items-center justify-center text-gray-300 hover:bg-[rgba(255,255,255,0.2)] hover:text-white transition-colors duration-200"
                title="Sign Out"
              >
                <span>🚪</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-[#F4D03F] flex items-center justify-center">
                <span className="text-sm font-medium text-gray-900">
                  {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {currentUser.displayName || 'User'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {currentUser.email}
                </p>
              </div>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-[rgba(255,255,255,0.1)] hover:text-white transition-colors duration-200"
            >
              <span className="mr-3">🚪</span>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
