import React from 'react';
import Skeleton from './Skeleton';

const Loader = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <Skeleton className="h-16 w-16 rounded-2xl" />
        </div>
        <div className="space-y-3 text-center">
          <Skeleton className="h-8 w-48 mx-auto rounded-lg" />
          <Skeleton className="h-4 w-64 mx-auto rounded-md" />
        </div>
        <div className="space-y-4 pt-4">
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-3/4 mx-auto rounded-xl" />
        </div>
        <div className="flex justify-center pt-4">
          <Skeleton className="h-12 w-40 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default Loader;
