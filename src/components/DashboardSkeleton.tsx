import React from 'react';
import Skeleton from './Skeleton';

const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-48 rounded-lg" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center space-x-4"
          >
            <Skeleton className="h-14 w-14 rounded-xl shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-20 rounded-md" />
              <Skeleton className="h-7 w-12 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mt-8 space-y-3">
        <Skeleton className="h-7 w-56 rounded-lg" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-3/4 rounded-md" />
      </div>
    </div>
  );
};

export default DashboardSkeleton;
