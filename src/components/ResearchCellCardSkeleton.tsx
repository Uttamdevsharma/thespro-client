import React from 'react';
import Skeleton from './Skeleton';

const ResearchCellCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 border border-slate-200/70 dark:border-slate-800 rounded-2xl p-7 flex flex-col h-full">
      <div className="mb-5">
        <Skeleton className="w-12 h-12 rounded-xl" />
      </div>
      <div className="space-y-2 flex-grow">
        <Skeleton className="h-3 w-24 rounded-md" />
        <Skeleton className="h-5 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
      </div>
      <div className="mt-6 flex items-center justify-between">
        <Skeleton className="h-4 w-28 rounded-md" />
        <Skeleton className="w-9 h-9 rounded-full" />
      </div>
    </div>
  );
};

export default ResearchCellCardSkeleton;
