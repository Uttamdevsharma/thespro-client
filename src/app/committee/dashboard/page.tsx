'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaUserGraduate, FaChalkboardTeacher, FaFileAlt, FaCheckCircle, FaHourglassHalf, FaFlask, FaUsers } from 'react-icons/fa';
import { useCycle } from '@/contexts/CycleContext';
import { useGetResearchCellsQuery, useGetProposalsQuery, useGetStudentsQuery, useGetTeachersQuery } from '@/store/features/apiSlice';
import Skeleton from '@/components/Skeleton';
import TableSkeleton from '@/components/TableSkeleton';

const CommitteeDashboard = () => {
  const router = useRouter();
  const { cycleId } = useCycle();
  const { data: researchCells, isLoading: loadingCells, error: cellsError } = useGetResearchCellsQuery();
  const { data: proposals, isLoading: loadingProposals, error: proposalsError } = useGetProposalsQuery({ thesisCycleId: cycleId || undefined });
  const { data: students, isLoading: loadingStudents, error: studentsError } = useGetStudentsQuery({ thesisCycleId: cycleId || undefined });
  const { data: teachers, isLoading: loadingTeachers, error: teachersError } = useGetTeachersQuery();

  const totalStudents = students?.length || 0;
  const totalTeachers = teachers?.length || 0;
  const totalProposals = proposals?.length || 0;
  const approvedProposals = proposals?.filter((p: any) => p.status === 'Approved').length || 0;
  const pendingProposals = proposals?.filter((p: any) => p.status === 'Pending').length || 0;
  const totalResearchCells = researchCells?.length || 0;
  const totalCommitteeMembers = 5;

  const isAnyLoading = loadingCells || loadingProposals || loadingStudents || loadingTeachers;
  const isAnyError = cellsError || proposalsError || studentsError || teachersError;

  if (isAnyError) {
    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
            <div className="bg-white dark:bg-gray-900 p-12 rounded-lg shadow-md text-center">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block mb-4 text-4xl">!</div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Error loading dashboard</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6 font-semibold italic text-sm">Failed to fetch data from server.</p>
                <button 
                onClick={() => window.location.reload()}
                className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg transition-colors"
                >
                Retry
                </button>
            </div>
        </div>
    );
  }

  const cardData = [
    { id: 'students', label: 'Total Students', value: totalStudents, icon: FaUserGraduate, bgColor: 'bg-blue-500', path: '/committee/all-students' },
    { id: 'teachers', label: 'Total Teachers', value: totalTeachers, icon: FaChalkboardTeacher, bgColor: 'bg-green-500', path: '/committee/all-teachers' },
    { id: 'proposals', label: 'Total Proposals', value: totalProposals, icon: FaFileAlt, bgColor: 'bg-purple-500', path: '/committee/all-groups' },
    { id: 'approved', label: 'Approved Proposals', value: approvedProposals, icon: FaCheckCircle, bgColor: 'bg-teal-500', path: '/committee/all-board-results' },
    { id: 'pending', label: 'Pending Proposals', value: pendingProposals, icon: FaHourglassHalf, bgColor: 'bg-orange-500', path: '/committee/pending-proposals' },
    { id: 'researchCells', label: 'Total Research Cells', value: totalResearchCells, icon: FaFlask, bgColor: 'bg-red-500', path: '/committee/research-cells' },
    { id: 'committeeMembers', label: 'Total Committee Members', value: totalCommitteeMembers, icon: FaUsers, bgColor: 'bg-indigo-500', path: '/committee/committee-members' },
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {cardData.map(card => (
          <div
            key={card.id}
            className={`${card.bgColor} text-white p-5 rounded-lg shadow-md flex items-center justify-between cursor-pointer hover:shadow-lg transition-shadow duration-300`}
            onClick={() => router.push(card.path)}
          >
            <div className="text-2xl">
              <card.icon />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{card.label}</p>
              {isAnyLoading ? (
                <Skeleton className="h-9 w-12 mt-1 ml-auto" />
              ) : (
                <p className="text-3xl font-bold">{card.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {loadingCells ? (
        <div className="space-y-8">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                <Skeleton className="h-8 w-64 mb-4" />
                <TableSkeleton rows={3} cols={4} />
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                <Skeleton className="h-8 w-48 mb-4" />
                <TableSkeleton rows={3} cols={4} />
            </div>
        </div>
      ) : researchCells && researchCells.length > 0 ? (
        <div className="space-y-8">
          {researchCells.map((cell: any) => (
            <div key={cell._id} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">{cell.title}</h2>
              <div className="overflow-x-auto max-h-96 overflow-y-auto relative">
                {loadingProposals ? (
                    <TableSkeleton rows={3} cols={4} />
                ) : (
                    <table className="min-w-full bg-white dark:bg-gray-900">
                    <thead className="sticky top-0 bg-gray-100">
                        <tr>
                        <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Proposal Title</th>
                        <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Supervisor</th>
                        <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Last Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proposals && proposals.filter((p: any) => p.researchCellId?._id === cell._id).length > 0 ? (
                        proposals.filter((p: any) => p.researchCellId?._id === cell._id).map((proposal: any) => (
                            <tr key={proposal._id}>
                            <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-sm">{proposal.title}</td>
                            <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-sm">{proposal.supervisorId?.name || 'N/A'}</td>
                            <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-sm">
                                <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    proposal.status === 'Pending'
                                    ? 'bg-orange-100 text-orange-800'
                                    : proposal.status === 'Approved'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                                >
                                {proposal.status}
                                </span>
                            </td>
                            <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-sm">{new Date(proposal.updatedAt || proposal.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))
                        ) : (
                        <tr>
                            <td colSpan={4} className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400 text-center italic">No proposals for this research cell.</td>
                        </tr>
                        )}
                    </tbody>
                    </table>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-lg text-gray-500 dark:text-gray-400 text-center py-10 italic">No research cells found.</p>
      )}
    </div>
  );
};

export default CommitteeDashboard;
