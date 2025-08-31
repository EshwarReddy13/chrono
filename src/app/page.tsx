'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="backdrop-blur-[16px] saturate-[180%] bg-[rgba(33,33,33,0.9)] border border-[rgba(189,189,189,0.4)] rounded-xl p-8 shadow-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFFF00] mx-auto"></div>
        <p className="text-white text-center mt-4">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
