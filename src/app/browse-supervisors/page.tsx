'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Loader from '@/components/Loader';

const BrowseSupervisorsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const departmentId = searchParams.get('department');
    const cellId = searchParams.get('cell');

    if (departmentId) {
      // Redirect to the dynamic route with the cell parameter
      const targetUrl = `/supervisors/${departmentId}${cellId ? `?cell=${cellId}` : ''}`;
      router.replace(targetUrl);
    } else {
      // If no department is provided, fallback to homepage
      router.replace('/');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center space-y-4">
        <Loader />
        <p className="text-gray-500 dark:text-gray-400 font-bold animate-pulse">Redirecting to supervisors...</p>
      </div>
    </div>
  );
};

const BrowseSupervisorsRedirect = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center space-y-4">
          <Loader />
          <p className="text-gray-500 dark:text-gray-400 font-bold animate-pulse">Loading...</p>
        </div>
      </div>
    }>
      <BrowseSupervisorsContent />
    </Suspense>
  );
};

export default BrowseSupervisorsRedirect;
