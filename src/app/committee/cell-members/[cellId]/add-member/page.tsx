'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
import toast from 'react-hot-toast';
import { ArrowLeft, PlusCircle, CheckCircle2 } from 'lucide-react';
import { useGetTeachersQuery, useGetResearchCellsQuery, useAssignCellMutation } from '@/store/features/apiSlice';

const CommitteeAddMembersToCellPage = () => {
  const router = useRouter();
  const params = useParams();
  const cellId = params.cellId as string;

  const { data: allTeachers, isLoading: loadingAllTeachers, error: allTeachersError } = useGetTeachersQuery();
  const { data: allCells, isLoading: loadingCells, error: cellsError } = useGetResearchCellsQuery();

  const researchCell = allCells?.find((cell: any) => cell._id === cellId);

  const [selectedTeacherIds, setSelectedTeacherIds] = useState<string[]>([]);
  const [assignCells, { isLoading: assigningCells }] = useAssignCellMutation();

  const teachersNotAssignedToCell = useMemo(() => {
    if (!allTeachers || !researchCell) return [];
    return allTeachers.filter((teacher: any) =>
      !teacher.researchCells.some((assignedCell: any) => (assignedCell._id || assignedCell) === cellId)
    );
  }, [allTeachers, researchCell, cellId]);

  const handleCheckboxChange = (teacherId: string) => {
    setSelectedTeacherIds(prev =>
      prev.includes(teacherId) ? prev.filter(id => id !== teacherId) : [...prev, teacherId]
    );
  };

  const handleAssignSelectedTeachers = async () => {
    if (selectedTeacherIds.length === 0) {
      toast.error("Please select at least one teacher to assign.");
      return;
    }

    try {
      await Promise.all(selectedTeacherIds.map(teacherId =>
        assignCells({ id: teacherId, cellIds: [cellId] }).unwrap()
      ));
      toast.success('Selected teachers assigned to cell successfully.');
      setSelectedTeacherIds([]);
      router.push(`/committee/cell-members/${cellId}`);
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to assign teachers.');
    }
  };

  if (loadingAllTeachers || loadingCells) return <Loader />;
  if (allTeachersError || cellsError || !researchCell) return <div className="p-10 text-center text-red-500 font-bold max-w-6xl mx-auto mt-10 bg-red-50 rounded-xl border border-red-100">Error: Could not load data.</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-5">
                <button
                    onClick={() => router.push(`/committee/cell-members/${cellId}`)}
                    className="p-3 hover:bg-white rounded-xl border border-gray-200 shadow-sm transition-all cursor-pointer bg-gray-50 group"
                >
                    <ArrowLeft size={24} className="text-gray-600 group-hover:text-green-600" />
                </button>
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Add Members to {researchCell.title}</h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">Select teachers to assign to this research area.</p>
                </div>
            </div>

            <button
                onClick={handleAssignSelectedTeachers}
                disabled={assigningCells || selectedTeacherIds.length === 0}
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl shadow-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:scale-[1.02] active:scale-100 disabled:bg-gray-400 disabled:scale-100 disabled:cursor-not-allowed"
            >
                <PlusCircle size={20} className="mr-2" />
                {assigningCells ? 'Assigning...' : `Assign ${selectedTeacherIds.length} Selected`}
            </button>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-extrabold text-gray-700 text-xs uppercase tracking-widest">Available Teachers</h3>
            </div>

            {teachersNotAssignedToCell && teachersNotAssignedToCell.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse bg-white">
                        <thead>
                            <tr className="bg-gray-50/20 border-b border-gray-100">
                                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-16">Select</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-16">Serial</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Teacher Name</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {teachersNotAssignedToCell.map((teacher: any, index: number) => (
                                <tr 
                                    key={teacher._id} 
                                    className={`hover:bg-green-50/20 transition-colors group cursor-pointer ${selectedTeacherIds.includes(teacher._id) ? 'bg-green-50/40' : ''}`}
                                    onClick={() => handleCheckboxChange(teacher._id)}
                                >
                                    <td className="px-8 py-5">
                                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${selectedTeacherIds.includes(teacher._id) ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 bg-white'}`}>
                                            {selectedTeacherIds.includes(teacher._id) && <CheckCircle2 size={16} />}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-bold text-gray-400">{index + 1 < 10 ? `0${index + 1}` : index + 1}</td>
                                    <td className="px-8 py-5 text-sm font-bold text-gray-900 group-hover:text-green-700 transition-colors">{teacher.name}</td>
                                    <td className="px-8 py-5 text-sm text-gray-600 font-medium">{teacher.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="p-20 text-center">
                    <p className="text-gray-400 text-lg font-medium italic">All teachers are already assigned to this cell or no teachers are available.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CommitteeAddMembersToCellPage;
