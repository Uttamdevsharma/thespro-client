import React from 'react';
import Skeleton from './Skeleton';

const ProposalSkeleton = () => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm p-5 space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-2 w-3/4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
    </div>
  );
};

export const ProposalListSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProposalSkeleton key={i} />
      ))}
    </div>
  );
};

export default ProposalSkeleton;
