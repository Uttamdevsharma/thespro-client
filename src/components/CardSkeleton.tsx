import React from 'react';
import Skeleton from './Skeleton';

interface CardSkeletonProps {
  className?: string;
  lines?: number;
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({ className = '', lines = 3 }) => {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-4 ${className}`}>
      <Skeleton className="h-5 w-3/4" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-3 ${i === lines - 1 ? 'w-1/2' : 'w-full'}`} />
      ))}
      <div className="pt-2">
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
};

export default CardSkeleton;
