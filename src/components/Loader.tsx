import React from 'react';
import Skeleton from './Skeleton';

const Loader = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Skeleton className="h-12 w-12 rounded-xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-48 mx-auto rounded-lg" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-3/4 mx-auto rounded-xl" />
        </div>
        <div className="flex justify-center">
          <Skeleton className="h-10 w-40 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default Loader;
