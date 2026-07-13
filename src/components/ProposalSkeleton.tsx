import React from 'react';
import Skeleton from './Skeleton';

const ProposalSkeleton = () => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm space-y-3">
      <Skeleton className="h-6 w-3/4 rounded-md" />
      <Skeleton className="h-4 w-32 rounded-md" />
      <Skeleton className="h-4 w-48 rounded-md" />
      <Skeleton className="h-4 w-40 rounded-md" />
      <div className="flex flex-wrap gap-1.5 pt-1">
        <Skeleton className="h-6 w-36 rounded-full" />
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-6 w-40 rounded-full" />
      </div>
      <div className="pt-1">
        <Skeleton className="h-5 w-28 rounded-md" />
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
