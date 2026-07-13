import React from 'react';
import Skeleton from './Skeleton';

interface CardSkeletonProps {
  className?: string;
  lines?: number;
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({ className = '', lines = 3 }) => {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-800 h-full ${className}`}>
      <Skeleton className="w-full h-[200px] rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className={`h-3 ${i === lines - 1 ? 'w-1/2' : 'w-full'}`} />
        ))}
        <div className="pt-2 flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="pt-1">
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;
