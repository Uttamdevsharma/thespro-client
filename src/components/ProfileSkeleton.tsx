import React from 'react';
import Skeleton from './Skeleton';

const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Skeleton className="w-24 h-24 rounded-full" />
            <div className="flex-1 space-y-3 text-center md:text-left">
              <Skeleton className="h-8 w-48 rounded-lg mx-auto md:mx-0" />
              <Skeleton className="h-4 w-32 rounded-md mx-auto md:mx-0" />
              <div className="flex gap-2 justify-center md:justify-start">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 space-y-6">
          <Skeleton className="h-6 w-40 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-24 rounded-md" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
