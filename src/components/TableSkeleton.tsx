import React from 'react';
import Skeleton from './Skeleton';

const TableSkeleton = ({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-900">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-950/50 border-b border-gray-100 dark:border-gray-800">
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="py-4 px-6 text-left">
                <Skeleton className="h-3 w-20 rounded-md" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="hover:bg-gray-50/50 dark:bg-gray-950/20 transition-colors">
              {Array.from({ length: cols }).map((_, j) => (
                <td key={j} className="py-4 px-6">
                  <Skeleton className={`h-4 rounded-md ${j === 0 ? 'w-3/4' : j === cols - 1 ? 'w-1/3' : 'w-full'}`} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;
