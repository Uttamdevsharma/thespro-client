import React from 'react';
import Skeleton from './Skeleton';

interface ListPageSkeletonProps {
  rows?: number;
  filterCount?: number;
}

const ListPageSkeleton: React.FC<ListPageSkeletonProps> = ({ rows = 8, filterCount = 3 }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          {Array.from({ length: filterCount }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-40 rounded-lg" />
          ))}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-6 space-y-0">
            {Array.from({ length: rows }).map((_, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 py-4 ${i < rows - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}
              >
                <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                  <Skeleton className="h-3 w-1/2 rounded-md" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListPageSkeleton;
