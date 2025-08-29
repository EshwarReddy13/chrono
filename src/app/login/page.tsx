'use client';

import { useState } from 'react';
import LoginForm from '@/components/login/LoginForm';
import SignupForm from '@/components/login/SignupForm';

export default function AuthPage() {
  const [showSignup, setShowSignup] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('signup') === 'true';
    }
    return false;
  });

  return (
    <div className="min-h-screen">
      {showSignup ? <SignupForm /> : <LoginForm />}
    </div>
  );
}
