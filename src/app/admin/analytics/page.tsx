'use client';

import React, { useState } from 'react';
import { useGetCycleAnalyticsQuery, useGetThesisCyclesQuery } from '@/store/features/apiSlice';
import ListPageSkeleton from '@/components/ListPageSkeleton';
import { BarChart3, Archive, TrendingUp, FileText, Users, CheckCircle, XCircle, Swords, Star, BookOpen } from 'lucide-react';

const statusColor: Record<string, string> = {
  Upcoming: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400',
  Active: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400',
  Completed: 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400',
};

const AdminAnalyticsPage = () => {
  const { data: cycles = [] } = useGetThesisCyclesQuery();
  const [selectedCycleId, setSelectedCycleId] = useState<string>('');
  const { data: analytics, isLoading } = useGetCycleAnalyticsQuery(selectedCycleId || undefined);

  const selectedCycleData = selectedCycleId
    ? (Array.isArray(analytics) ? analytics[0] : analytics)
    : null;
  const allCyclesData = !selectedCycleId && Array.isArray(analytics) ? analytics : [];

  const displayData = selectedCycleId && selectedCycleData
    ? [selectedCycleData]
    : allCyclesData;

  if (isLoading) return <ListPageSkeleton />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
            <BarChart3 className="text-indigo-600" size={32} />
            Cycle Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Historical statistics and cohort reporting</p>
        </div>
        <select
          value={selectedCycleId}
          onChange={(e) => setSelectedCycleId(e.target.value)}
          className="px-4 py-2 border rounded-lg text-sm font-medium bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">All Cycles</option>
          {cycles.map((c: any) => (
            <option key={c._id} value={c._id}>
              {c.name} {c.archived ? '(archived)' : ''}
            </option>
          ))}
        </select>
      </div>

      {displayData.length === 0 && (
        <div className="text-center py-20 text-gray-400 dark:text-gray-500">
          <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No cycle data available</p>
        </div>
      )}

      <div className="space-y-6">
        {displayData.map((cycle: any) => {
          const s = cycle.stats || {};
          const statCards = [
            { label: 'Total Proposals', value: s.totalProposals, icon: FileText, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
            { label: 'Approved', value: s.approvedProposals, icon: CheckCircle, color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
            { label: 'Pending', value: s.pendingProposals, icon: TrendingUp, color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' },
            { label: 'Not Approved', value: s.notApproved, icon: XCircle, color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
            { label: 'Defense Boards', value: s.defenseBoards, icon: Swords, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
            { label: 'Evaluations', value: s.evaluations, icon: Star, color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' },
            { label: 'Published Results', value: s.publishedResults, icon: BookOpen, color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' },
          ];

          return (
            <div key={cycle._id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    {cycle.name}
                    {cycle.archived && <Archive size={16} className="text-gray-400" />}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {cycle.startSemester} &rarr; {cycle.endSemester}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[cycle.status] || ''}`}>
                  {cycle.status}
                </span>
              </div>

              <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {statCards.map((stat, idx) => (
                  <div key={idx} className="bg-gray-50 dark:bg-gray-950 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</span>
                      <stat.icon size={16} className="text-gray-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
