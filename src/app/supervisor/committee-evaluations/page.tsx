'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGetMyCommitteeEvaluationsQuery } from '@/store/features/apiSlice';
import ListPageSkeleton from '@/components/ListPageSkeleton';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';

const SupervisorBoardOverviewPage = () => {
    const router = useRouter();
    const [defenseTypeFilter, setDefenseTypeFilter] = useState('Pre-Defense');

    const {
        data: boards,
        isLoading,
        isError,
        error,
        refetch: refetchBoards
    } = useGetMyCommitteeEvaluationsQuery(defenseTypeFilter);

    useEffect(() => {
        refetchBoards();
    }, [defenseTypeFilter, refetchBoards]);

    if (isLoading) return <ListPageSkeleton />;
    if (isError) return <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-6xl mx-auto mt-10">Error: {(error as any)?.message || 'Failed to load boards.'}</div>;

    return (
        <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-6 border-b pb-3">My Assigned Boards</h1>

                {/* Filter Section */}
                <div className="mb-6 max-w-sm bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <label htmlFor="defenseTypeFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        Filter by Defense Type:
                    </label>
                    <select
                        id="defenseTypeFilter"
                        value={defenseTypeFilter}
                        onChange={(e) => setDefenseTypeFilter(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 p-2 text-gray-700 dark:text-gray-200 font-medium"
                    >
                        <option value="Pre-Defense">Pre-Defense</option>
                        <option value="Final Defense">Final Defense</option>
                    </select>
                </div>

                {/* Boards Table */}
                {boards && boards.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 dark:bg-gray-950">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Board
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Defense Type
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Room
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Time
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200">
                                {boards.map((board: any) => (
                                    <tr key={board._id} className="hover:bg-gray-50 dark:bg-gray-950 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-gray-50">
                                            Board {board.boardNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {board.defenseType}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {board.room?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {board.date ? format(new Date(board.date), 'dd/MM/yyyy') : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {board.schedule?.startTime && board.schedule?.endTime ? `${board.schedule.startTime} - ${board.schedule.endTime}` : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => router.push(`/supervisor/committee-evaluations/${board._id}`)}
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                            >
                                                <Eye className="w-5 h-5 mr-2" />
                                                View Groups
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-10 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-950 rounded-lg border border-dashed">
                        <p>No assigned boards found for {defenseTypeFilter} type.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupervisorBoardOverviewPage;
