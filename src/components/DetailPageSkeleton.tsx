import React from 'react';
import Skeleton from './Skeleton';

interface DetailPageSkeletonProps {
  withStatus?: boolean;
  withActions?: boolean;
}

const DetailPageSkeleton: React.FC<DetailPageSkeletonProps> = ({ withStatus = true, withActions = true }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-28 pb-20 font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Skeleton className="h-4 w-28 rounded-md" />

        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-8 pb-6 border-b border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <Skeleton className="h-3 w-28 rounded-md" />
                <Skeleton className="h-3 w-24 rounded-md" />
                <Skeleton className="h-3 w-32 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-8 w-3/4 rounded-lg" />
          </div>

          <div className="p-8 pt-6 space-y-3">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPageSkeleton;
