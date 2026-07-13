import React from 'react';
import Skeleton from './Skeleton';

const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-32 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <Skeleton className="h-4 w-32 rounded-md" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
            <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-10 shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center space-y-6">
              <Skeleton className="w-48 h-48 rounded-[3rem]" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-40 rounded-lg mx-auto" />
                <Skeleton className="h-4 w-32 rounded-md mx-auto" />
              </div>
              <Skeleton className="h-px w-full" />
              <div className="w-full space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                  <Skeleton className="h-4 w-40 rounded-md" />
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                  <Skeleton className="h-4 w-24 rounded-md" />
                </div>
              </div>
              <Skeleton className="w-full h-14 rounded-2xl" />
            </div>

            <div className="mt-8 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-lg border border-gray-100 dark:border-gray-800 space-y-4">
              <div className="flex items-center space-x-3">
                <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                <Skeleton className="h-5 w-44 rounded-lg" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-28 rounded-xl" />
                <Skeleton className="h-8 w-36 rounded-xl" />
                <Skeleton className="h-8 w-24 rounded-xl" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-10">
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-2 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex gap-2">
                <Skeleton className="flex-1 h-12 rounded-2xl" />
                <Skeleton className="flex-1 h-12 rounded-2xl" />
                <Skeleton className="flex-1 h-12 rounded-2xl" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
              <div className="flex items-center space-x-3">
                <Skeleton className="w-12 h-12 rounded-2xl" />
                <Skeleton className="h-6 w-48 rounded-lg" />
              </div>
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 space-y-3">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-5 w-32 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-md" />
              </div>
              <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 space-y-3">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-5 w-24 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
