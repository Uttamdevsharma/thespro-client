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
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64 rounded-lg" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        )}

        <div className={`grid ${withSidebar ? 'grid-cols-1 lg:grid-cols-4 gap-8' : ''}`}>
          <div className={withSidebar ? 'lg:col-span-3 space-y-6' : 'space-y-6'}>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <Skeleton className="h-6 w-48 rounded-lg" />
              </div>
              <div className="divide-y divide-gray-100 dark:border-gray-800">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="p-6 flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4 rounded-md" />
                      <Skeleton className="h-3 w-1/2 rounded-md" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {withSidebar && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-4">
                <Skeleton className="h-6 w-32 rounded-lg" />
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
