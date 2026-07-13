'use client';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useCycle } from '@/contexts/CycleContext';
import { useGetMySupervisionsQuery } from '@/store/features/apiSlice';
import ListPageSkeleton from '@/components/ListPageSkeleton';
import Link from 'next/link';
import { Eye } from 'lucide-react';

const SupervisorGroupsOverviewPage = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const { cycleId } = useCycle();
    const { data: proposals, isLoading, isError, error, refetch: refetchProposals } = useGetMySupervisionsQuery({ thesisCycleId: cycleId || undefined }, {
        skip: !user
    });

    useEffect(() => {
        if (user) {
            refetchProposals();
        }
    }, [refetchProposals, user]);

    if (isLoading) return <ListPageSkeleton />;
    if (isError) {
        return (
            <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-6xl mx-auto mt-10">
                Error: {(error as any)?.message || 'Failed to load supervisions.'}
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-6 border-b pb-3">My Supervised Groups</h1>

                {proposals && proposals.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 dark:bg-gray-950">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Group SL
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Member Names
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200">
                                {proposals.map((proposal: any, index: number) => (
                                    <tr key={proposal._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-50">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {proposal.members.map((member: any) => member.name).join(', ')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {proposal.title}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {proposal.type}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={`/supervisor/evaluate-group/${proposal._id}`}
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                            >
                                                <Eye className="w-5 h-5 mr-2" />
                                                Evaluate
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-10 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-950 rounded-lg border border-dashed">
                        <p>No supervised groups found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupervisorGroupsOverviewPage;
