'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';
import { Trophy, Filter, ShieldCheck, UserCheck } from 'lucide-react';
import { useGetSupervisorDefenseResultsQuery } from '@/store/features/apiSlice';

const SupervisorDefenseResultPage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [supervisionFilter, setSupervisionFilter] = useState('all');
  const [defenseTypeFilter, setDefenseTypeFilter] = useState('Pre-Defense');

  const { data: defenseResults = [], isLoading: loading, error: queryError } = useGetSupervisorDefenseResultsQuery({ 
    filter: supervisionFilter, 
    defenseType: defenseTypeFilter 
  }, {
    skip: !user
  });

  const error = queryError ? ((queryError as any).data?.message || (queryError as any).message) : null;

  if (loading) return <Loader />;

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 mb-8 flex items-center">
            <Trophy className="mr-3 text-green-600" size={32} />
            Defense Results
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Supervision Filter */}
            <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                <label htmlFor="supervisionFilter" className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2 flex items-center">
                    <UserCheck size={16} className="mr-2" /> Filter by Supervision
                </label>
                <select
                    id="supervisionFilter"
                    value={supervisionFilter}
                    onChange={(e) => setSupervisionFilter(e.target.value)}
                    className="block w-full bg-white dark:bg-gray-900 border border-gray-300 rounded-lg py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 transition-all font-semibold"
                >
                    <option value="all">All Groups</option>
                    <option value="my_supervision">Under my supervision only</option>
                    <option value="my_course_supervision">Under my course supervision only</option>
                </select>
            </div>

            {/* Defense Type Filter */}
            <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                <label htmlFor="defenseTypeFilter" className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2 flex items-center">
                    <ShieldCheck size={16} className="mr-2" /> Filter by Defense Type
                </label>
                <select
                    id="defenseTypeFilter"
                    value={defenseTypeFilter}
                    onChange={(e) => setDefenseTypeFilter(e.target.value)}
                    className="block w-full bg-white dark:bg-gray-900 border border-gray-300 rounded-lg py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 transition-all font-semibold"
                >
                    <option value="Pre-Defense">Pre-Defense</option>
                    <option value="Final Defense">Final Defense</option>
                </select>
            </div>
        </div>

        {error ? (
            <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium text-center">
                Error: {error}
            </div>
        ) : (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
            {defenseResults.length === 0 ? (
                <div className="p-20 text-center text-gray-400 italic">
                    <p className="text-lg">No {defenseTypeFilter.toLowerCase()} defense results found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-gray-950">
                    <tr>
                        <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">SL</th>
                        <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Students</th>
                        <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project Title</th>
                        <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                        <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Board Members</th>
                        <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Comments</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200">
                    {defenseResults.map((result, index) => (
                        <tr key={result._id} className="hover:bg-gray-50 dark:bg-gray-950 transition-colors">
                        <td className="py-4 px-6 text-sm font-bold text-gray-900 dark:text-gray-50">{index + 1}</td>
                        <td className="py-4 px-6">
                            <div className="flex flex-col gap-1">
                                {result.students.map((s: any) => (
                                    <div key={s.studentId} className="flex items-center text-xs">
                                        <span className="bg-gray-100 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded font-mono font-bold mr-2">{s.studentId}</span>
                                        <span className="text-gray-900 dark:text-gray-50 font-medium">{s.name}</span>
                                    </div>
                                ))}
                            </div>
                        </td>
                        <td className="py-4 px-6 text-sm font-semibold text-gray-900 dark:text-gray-50">{result.title}</td>
                        <td className="py-4 px-6">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-[10px] font-bold uppercase">
                                {result.type}
                            </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300 font-medium">
                            <div className="flex flex-wrap gap-1">
                                {result.boardMembers.map((m: string, i: number) => (
                                    <span key={i} className="bg-gray-50 dark:bg-gray-950 px-2 py-1 rounded border border-gray-100 dark:border-gray-800">{m}</span>
                                ))}
                            </div>
                        </td>
                        <td className="py-4 px-6 text-sm">
                            <div className="space-y-3 max-w-xs">
                                {result.comments.map((c: any, i: number) => (
                                <div key={i} className="bg-green-50 p-2 rounded-lg border border-green-100">
                                    <p className="text-[10px] font-bold text-green-700 uppercase mb-1">{c.commentedBy}</p>
                                    <p className="text-gray-800 dark:text-gray-100 text-sm italic">"{c.text}"</p>
                                </div>
                                ))}
                            </div>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}
            </div>
        )}
      </div>
    </div>
  );
};

export default SupervisorDefenseResultPage;
