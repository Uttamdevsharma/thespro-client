import React from 'react';
import Skeleton from './Skeleton';

const SupervisorCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-800 h-full">
      <div className="relative">
        <Skeleton className="w-full h-[240px] rounded-none" />
        <div className="absolute bottom-0 w-full py-2 px-2">
          <Skeleton className="h-4 w-32 mx-auto rounded-md" />
        </div>
      </div>
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4 mx-auto rounded-md" />
        <div className="flex justify-center gap-1 pt-2 border-t border-gray-50 dark:border-gray-800">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default SupervisorCardSkeleton;
