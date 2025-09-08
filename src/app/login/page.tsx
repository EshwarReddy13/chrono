'use client';

import { useState } from 'react';
import LoginForm from '@/components/login/LoginForm';
import SignupForm from '@/components/login/SignupForm';

export default function AuthPage() {
  const [showSignup] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('signup') === 'true';
    }
    return false;
  });

  return (
    <>
      
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: 'url(/assets/images/background.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        
        {/* Login/Signup Form */}
        <div className="relative z-20 w-full flex justify-center">
          {showSignup ? <SignupForm /> : <LoginForm />}
        </div>
      </div>
    </>
  );
}
