'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageSkeleton from '@/components/PageSkeleton';
import toast from 'react-hot-toast';
import { ArrowLeft, PlusCircle, ShieldCheck, User, FlaskConical, CheckCircle2 } from 'lucide-react';
import {
  useGetUserByIdQuery,
  useGetResearchCellsQuery,
  useAssignCellMutation
} from '@/store/features/apiSlice';

const CommitteeAssignCellToTeacherPage = () => {
  const router = useRouter();
  const params = useParams();
  const teacherId = params.teacherId as string;

  const { data: teacher, isLoading: loadingTeacher, error: teacherError, refetch: refetchTeacher } = useGetUserByIdQuery(teacherId);
  const { data: allCells, isLoading: loadingCells, error: cellsError, refetch: refetchCells } = useGetResearchCellsQuery();
  const [assignCells, { isLoading: assigningCells }] = useAssignCellMutation();

  const [selectedCellIds, setSelectedCellIds] = useState<string[]>([]);

  const cellsNotAssigned = useMemo(() => {
    if (!allCells || !teacher) return [];
    const assignedCellIds = teacher.researchCells.map((cell: any) => cell._id);
    return allCells.filter((cell: any) => !assignedCellIds.includes(cell._id));
  }, [allCells, teacher]);

  const handleCheckboxChange = (cellId: string) => {
    setSelectedCellIds(prev =>
      prev.includes(cellId) ? prev.filter(id => id !== cellId) : [...prev, cellId]
    );
  };

  const handleAssignSelectedCells = async () => {
    if (selectedCellIds.length === 0) {
      toast.error("Please select at least one cell to assign.");
      return;
    }

    try {
      await assignCells({ id: teacherId, cellIds: selectedCellIds }).unwrap();
      toast.success('Cells assigned successfully.');
      setSelectedCellIds([]);
      refetchTeacher();
      refetchCells();
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to assign cells.');
    }
  };

  if (loadingTeacher || loadingCells) return <PageSkeleton />;
  if (teacherError || cellsError || !teacher) return <div className="p-10 text-center text-red-500 font-bold bg-red-50 rounded-2xl border border-red-100 max-w-4xl mx-auto mt-10 tracking-tight">Data retrieval failed. Please verify teacher ID.</div>;

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-5 mb-10">
            <button
                onClick={() => router.push('/committee/all-teachers')}
                className="p-3 hover:bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all cursor-pointer bg-gray-50 dark:bg-gray-950 group"
            >
                <ArrowLeft size={24} className="text-gray-600 dark:text-gray-300 group-hover:text-green-600" />
            </button>
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight flex items-center">
                    <FlaskConical className="mr-3 text-green-600" size={32} />
                    Cell Allocation
                </h1>
                <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">Assign research cells to faculty members</p>
            </div>
        </div>

        <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-3xl p-8 mb-10 border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <User size={120} className="text-blue-500" />
            </div>

            <div className="w-24 h-24 bg-blue-50 border-4 border-white shadow-xl rounded-full flex items-center justify-center text-blue-600 text-3xl font-black shrink-0 ring-4 ring-blue-50/50">
                {teacher.name.charAt(0)}
            </div>
            <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-black text-gray-900 dark:text-gray-50 tracking-tight uppercase">{teacher.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-bold flex items-center justify-center md:justify-start gap-2 mt-1">
                    <ShieldCheck size={16} className="text-green-500" /> {teacher.email}
                </p>
                
                <div className="mt-4 flex flex-col md:flex-row md:items-center gap-3">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Specializations:</span>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {teacher.researchCells && teacher.researchCells.length > 0 ? (
                            teacher.researchCells.map((cell: any) => (
                                <span key={cell._id} className="inline-flex items-center bg-green-50 text-green-700 text-[10px] font-black px-3 py-1 rounded-lg border border-green-100 uppercase tracking-tight">
                                    <CheckCircle2 size={12} className="mr-1" />
                                    {cell.title}
                                </span>
                            ))
                        ) : (
                            <span className="text-xs font-bold text-red-400 italic">No cells assigned yet</span>
                        )}
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-10 py-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50 flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h3 className="font-black text-gray-800 dark:text-gray-100 text-sm uppercase tracking-widest">Available Domains</h3>
                    <p className="text-[10px] text-gray-400 font-bold">Select one or more cells to expand authority</p>
                </div>
                <button
                    onClick={handleAssignSelectedCells}
                    disabled={assigningCells || selectedCellIds.length === 0}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-xs font-black rounded-2xl shadow-xl shadow-green-100 transition-all transform active:scale-95 disabled:bg-gray-300 disabled:shadow-none"
                >
                    <PlusCircle size={16} />
                    {assigningCells ? 'SYNCHRONIZING...' : 'AUTHORIZE SELECTION'}
                </button>
            </div>

            <div className="overflow-x-auto">
                {cellsNotAssigned && cellsNotAssigned.length > 0 ? (
                    <table className="w-full text-left border-collapse bg-white dark:bg-gray-900">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-950/30 border-b border-gray-100 dark:border-gray-800">
                                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-16 text-center">Opt</th>
                                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center w-16">Seq</th>
                                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Research Domain Title</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {cellsNotAssigned.map((cell: any, index: number) => (
                                <tr 
                                    key={cell._id} 
                                    className={`hover:bg-green-50/20 transition-all group cursor-pointer ${selectedCellIds.includes(cell._id) ? 'bg-green-50/40' : ''}`}
                                    onClick={() => handleCheckboxChange(cell._id)}
                                >
                                    <td className="px-10 py-6 text-center">
                                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${selectedCellIds.includes(cell._id) ? 'bg-green-600 border-green-600 text-white shadow-lg' : 'border-gray-300 bg-white dark:bg-gray-900'}`}>
                                            {selectedCellIds.includes(cell._id) && <CheckCircle2 size={16} />}
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        <span className="text-sm font-black text-gray-300">{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className="text-sm font-black text-gray-800 dark:text-gray-100 uppercase tracking-wide group-hover:text-green-700 transition-all font-mono">{cell.title}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-20 text-center">
                        <p className="text-gray-400 text-lg font-bold italic">This faculty member is already assigned to all active domains.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CommitteeAssignCellToTeacherPage;
