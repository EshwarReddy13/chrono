'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Google icon component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await signIn(email, password);
    } catch (error) {
      setError('Failed to sign in. Please check your credentials.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setGoogleLoading(true);
      await signInWithGoogle();
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.');
      console.error('Google sign in error:', error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full py-12">
      <div className="w-full max-w-md mx-auto space-y-8">
        {/* Glass effect container */}
        <div className="w-full backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Log in to Chrono
            </h2>
            <p className="mt-2 text-center text-sm text-gray-300">
              Track your time, boost your productivity
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-900/50 border border-red-400/30 text-red-200 px-4 py-3 rounded-xl backdrop-blur-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-3 border border-gray-500/50 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFFF00] focus:border-[#FFFF00] bg-[rgba(33,33,33)] text-white placeholder-gray-400 backdrop-blur-sm"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-3 border border-gray-500/50 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFFF00] focus:border-[#FFFF00] bg-[rgba(33,33,33)] text-white placeholder-gray-400 backdrop-blur-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-6 border-2 border-black text-sm font-medium rounded-xl text-black bg-[#F4D03F] hover:bg-black hover:text-[#F4D03F] hover:border-[#F4D03F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F4D03F] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-500/50" />
                </div>
                <div className="relative flex justify-center text-sm">
                                     <span className="px-2 bg-white/10 text-gray-400">Or continue with</span>
                </div>
              </div>
              
                             <button
                 type="button"
                 onClick={handleGoogleSignIn}
                 disabled={googleLoading}
                 className="w-full flex justify-center items-center py-3 px-6 border border-gray-500/50 rounded-xl shadow-sm text-sm font-medium text-gray-200 bg-[rgba(33,33,33)] hover:bg-[rgba(255,255,255,0.1)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFFF00] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-xl backdrop-blur-sm"
               >
                <GoogleIcon />
                <span className="ml-2">
                  {googleLoading ? 'Signing in...' : 'Sign in with Google'}
                </span>
              </button>
                         </div>
           </form>
           
           <div className="text-center mt-6">
             <p className="text-sm text-gray-300">
               Don&apos;t have an account?{' '}
                               <button
                  onClick={() => window.location.href = '/login?signup=true'}
                  className="font-medium text-[#FFFF00] hover:text-[#F2EC9B] transition-colors duration-200"
                >
                  Sign up
                </button>
             </p>
           </div>
         </div>
       </div>
     </div>
   );
 }
