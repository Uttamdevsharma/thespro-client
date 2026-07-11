import React from 'react';

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`relative isolate overflow-hidden bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5" />
    </div>
  );
};

export default Skeleton;
