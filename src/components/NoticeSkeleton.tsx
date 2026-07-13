import React from 'react';
import Skeleton from './Skeleton';

const NoticeSkeleton = () => {
  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0 flex-1">
          <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="h-3 w-full rounded-md" />
            <Skeleton className="h-3 w-2/3 rounded-md" />
            <div className="flex items-center gap-4 pt-1">
              <Skeleton className="h-3 w-24 rounded-md" />
              <Skeleton className="h-3 w-20 rounded-md" />
              <Skeleton className="h-3 w-16 rounded-md" />
            </div>
          </div>
        </div>
        <Skeleton className="h-5 w-5 shrink-0 mt-1" />
      </div>
    </div>
  );
};

export const NoticeListSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <NoticeSkeleton key={i} />
      ))}
    </div>
  );
};

export default NoticeSkeleton;
