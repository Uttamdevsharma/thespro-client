import React from 'react';
import Skeleton from './Skeleton';

const NoticeSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm flex items-start gap-4 mb-3">
      <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  );
};

export const NoticeListSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-1">
      {Array.from({ length: count }).map((_, i) => (
        <NoticeSkeleton key={i} />
      ))}
    </div>
  );
};

export default NoticeSkeleton;
