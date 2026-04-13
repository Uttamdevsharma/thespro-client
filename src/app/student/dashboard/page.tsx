'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useGetStudentProposalsQuery, useGetNoticesQuery } from '@/store/features/apiSlice';
import ProgressBar from '@/components/ProgressBar';
import NoticeItem from '@/components/NoticeItem';
import Skeleton from '@/components/Skeleton';
import { NoticeListSkeleton } from '@/components/NoticeSkeleton';

const StudentDashboard = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const { data: proposals, isLoading: proposalsLoading } = useGetStudentProposalsQuery((user as any)?._id, { skip: !user });
  const { data: notices, isLoading: noticesLoading } = useGetNoticesQuery((user as any)?._id, { skip: !user });

  const studentName = user?.name || user?.email || 'Student';

  const latestProposal = proposals?.[0];

  const committeeNotices = notices ? notices.filter((notice: any) => notice.sender.role === 'committee') : [];
  const supervisorNotices = notices ? notices.filter((notice: any) => notice.sender.role === 'supervisor') : [];

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Hi {studentName}, welcome back to ThesPro!
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Here is an overview of your current proposal and recent notices.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Proposal Status</h2>
        {proposalsLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ) : latestProposal ? (
          <ProgressBar status={latestProposal.status} />
        ) : (
          <p className="text-lg text-gray-500 dark:text-gray-400">
            You have not submitted any proposals yet. Let’s start your academic journey!
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Committee Notices</h2>
          {noticesLoading ? (
            <NoticeListSkeleton count={3} />
          ) : committeeNotices && committeeNotices.length > 0 ? (
            <div>
              {committeeNotices.map((notice: any) => (
                <NoticeItem key={notice._id} notice={notice} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">No new notices from the committee.</p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Supervisor Notices</h2>
          {noticesLoading ? (
            <NoticeListSkeleton count={3} />
          ) : supervisorNotices && supervisorNotices.length > 0 ? (
            <div>
              {supervisorNotices.map((notice: any) => (
                <NoticeItem key={notice._id} notice={notice} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">No new notices from your supervisor.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
