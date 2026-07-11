import React from 'react';
import CardSkeleton from './CardSkeleton';

interface CardGridSkeletonProps {
  columns?: number;
  rows?: number;
  lines?: number;
}

const CardGridSkeleton: React.FC<CardGridSkeletonProps> = ({ columns = 3, rows = 2, lines = 3 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: columns * rows }).map((_, i) => (
        <CardSkeleton key={i} lines={lines} />
      ))}
    </div>
  );
};

export default CardGridSkeleton;
