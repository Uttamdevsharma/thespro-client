import React from 'react';
import Skeleton from './Skeleton';

interface DetailPageSkeletonProps {
  withStatus?: boolean;
  withActions?: boolean;
}

const DetailPageSkeleton: React.FC<DetailPageSkeletonProps> = ({ withStatus = true, withActions = true }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back button */}
        <Skeleton className="h-8 w-20 rounded-lg" />

        {/* Header */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <Skeleton className="h-8 w-3/4 rounded-lg" />
              <div className="flex gap-3">
                <Skeleton className="h-6 w-32 rounded-full" />
                {withStatus && <Skeleton className="h-6 w-24 rounded-full" />}
              </div>
            </div>
            {withActions && (
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24 rounded-lg" />
                <Skeleton className="h-10 w-24 rounded-lg" />
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-6 space-y-4">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-20 rounded-md" />
                <Skeleton className="h-5 w-40 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPageSkeleton;
