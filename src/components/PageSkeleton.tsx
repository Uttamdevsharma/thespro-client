import React from 'react';
import Skeleton from './Skeleton';

interface PageSkeletonProps {
  withHeader?: boolean;
  withSidebar?: boolean;
}

const PageSkeleton: React.FC<PageSkeletonProps> = ({ withHeader = true, withSidebar = false }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {withHeader && (
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64 rounded-lg" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        )}

        <div className={`grid ${withSidebar ? 'grid-cols-1 lg:grid-cols-4 gap-8' : ''}`}>
          <div className={withSidebar ? 'lg:col-span-3 space-y-6' : 'space-y-6'}>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            </div>
          </div>
          {withSidebar && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageSkeleton;
