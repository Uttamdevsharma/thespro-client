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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-4 w-36" />
          </div>
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>

        <div className="flex gap-3">
          {Array.from({ length: filterCount }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-40 rounded-lg" />
          ))}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-950/50 border-b border-gray-100 dark:border-gray-800">
                  {Array.from({ length: filterCount + 2 }).map((_, i) => (
                    <th key={i} className="py-5 px-8">
                      <Skeleton className="h-3 w-20 rounded-md" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {Array.from({ length: rows }).map((_, i) => (
                  <tr key={i} className="hover:bg-green-50/20 transition-all group">
                    <td className="py-5 px-8">
                      <Skeleton className="h-10 w-10 rounded-xl" />
                    </td>
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                        <Skeleton className="h-4 w-36 rounded-md" />
                      </div>
                    </td>
                    <td className="py-5 px-8">
                      <Skeleton className="h-4 w-48 rounded-md" />
                    </td>
                    <td className="py-5 px-8">
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </td>
                    <td className="py-5 px-8 text-right">
                      <Skeleton className="h-8 w-28 rounded-lg ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListPageSkeleton;
