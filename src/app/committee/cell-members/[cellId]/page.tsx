'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetResearchCellsQuery, useRemoveCellMutation, useGetTeachersQuery } from '@/store/features/apiSlice';
import Loader from '@/components/Loader';
import toast from 'react-hot-toast';
import { ArrowLeft, User, PlusCircle, Trash2 } from 'lucide-react';

const CommitteeCellMembersDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const cellId = params.cellId as string;

  const { data: allTeachers, isLoading: loadingAllTeachers, error: allTeachersError } = useGetTeachersQuery();
  const { data: allCells, isLoading: loadingCells, error: cellsError } = useGetResearchCellsQuery();

  const researchCell = allCells?.find((cell: any) => cell._id === cellId);

  const cellMembers = allTeachers?.filter((teacher: any) =>
    teacher.researchCells.some((assignedCell: any) => (assignedCell._id || assignedCell) === cellId)
  );

  const [removeCell, { isLoading: removingCell }] = useRemoveCellMutation();

  const handleRemoveMember = async (teacherId: string, teacherName: string) => {
    if (window.confirm(`Are you sure you want to remove ${teacherName} from this cell?`)) {
      try {
        await removeCell({ id: teacherId, cellId }).unwrap();
        toast.success(`${teacherName} removed from cell successfully.`);
      } catch (error: any) {
        toast.error(error.data?.message || 'Failed to remove member.');
      }
    }
  };

  if (loadingAllTeachers || loadingCells) return <Loader />;
  if (allTeachersError || cellsError || !researchCell) return <div className="p-10 text-center text-red-500 font-bold max-w-6xl mx-auto mt-10 bg-red-50 rounded-xl border border-red-100">Error: Could not load cell details or members.</div>;

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-5">
                <button
                    onClick={() => router.push('/committee/cell-members')}
                    className="p-3 hover:bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all cursor-pointer bg-gray-50 dark:bg-gray-950 group"
                >
                    <ArrowLeft size={24} className="text-gray-600 dark:text-gray-300 group-hover:text-green-600" />
                </button>
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight">{researchCell.title}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">{researchCell.description}</p>
                </div>
            </div>

            <button
                onClick={() => router.push(`/committee/cell-members/${cellId}/add-member`)}
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl shadow-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:scale-[1.02] active:scale-100"
            >
                <PlusCircle size={20} className="mr-2" />
                Add New Member
            </button>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-8 py-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50 flex justify-between items-center">
                <h3 className="font-extrabold text-gray-700 dark:text-gray-200 text-xs uppercase tracking-widest">Cell Members List</h3>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">{cellMembers?.length || 0} Members</span>
            </div>

            {cellMembers && cellMembers.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse bg-white dark:bg-gray-900">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-950/20 border-b border-gray-100 dark:border-gray-800">
                                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Serial</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Name</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {cellMembers.map((member: any, index: number) => (
                                <tr key={member._id} className="hover:bg-green-50/20 transition-colors group">
                                    <td className="px-8 py-5 text-sm font-bold text-gray-400">{index + 1 < 10 ? `0${index + 1}` : index + 1}</td>
                                    <td className="px-8 py-5 text-sm font-bold text-gray-900 dark:text-gray-50 group-hover:text-green-700 transition-colors">{member.name}</td>
                                    <td className="px-8 py-5 text-sm text-gray-600 dark:text-gray-300 font-medium">{member.email}</td>
                                    <td className="px-8 py-5 text-right">
                                        <button
                                            onClick={() => handleRemoveMember(member._id, member.name)}
                                            disabled={removingCell}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-bold rounded-lg shadow-sm text-white bg-red-500 hover:bg-red-600 transition-colors focus:outline-none disabled:bg-red-300 disabled:cursor-not-allowed"
                                        >
                                            <Trash2 size={14} className="mr-2" />
                                            {removingCell ? 'Removing...' : 'Remove'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="p-20 text-center">
                    <div className="bg-gray-50 dark:bg-gray-950 inline-block p-4 rounded-full mb-4">
                        <User size={32} className="text-gray-400" />
                    </div>
                    <p className="text-gray-400 text-lg font-medium italic">No members assigned to this cell yet.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CommitteeCellMembersDetailPage;
