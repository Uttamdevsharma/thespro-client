'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCycle } from '@/contexts/CycleContext';
import { useGetAvailableProposalsQuery } from '@/store/features/apiSlice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setBoardDraft } from '@/store/features/boardDraftSlice';
import toast from 'react-hot-toast';
import PageSkeleton from '@/components/PageSkeleton';
import { ArrowLeft, CheckCircle2, Users, BookOpen, UserCheck, CheckCircle } from 'lucide-react';

const CommitteeSelectGroupsPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { cycleId } = useCycle();
  const boardDraft = useSelector((state: RootState) => state.boardDraft);
  const defenseType = boardDraft?.defenseType;

  const { data: availableProposals, isLoading } = useGetAvailableProposalsQuery({ defenseType, thesisCycleId: cycleId || undefined });
  const [selectedGroups, setSelectedGroups] = useState<string[]>(boardDraft?.groups || []);

  const handleCheckboxChange = (groupId: string) => {
    if (selectedGroups.includes(groupId)) {
      setSelectedGroups(selectedGroups.filter(id => id !== groupId));
    } else {
      setSelectedGroups([...selectedGroups, groupId]);
    }
  };

  const handleAddGroups = () => {
    if (selectedGroups.length === 0) {
      toast.error('Please select at least one group.');
      return;
    }
    dispatch(setBoardDraft({ groups: selectedGroups }));
    toast.success('Groups updated successfully in draft.');
    router.push('/committee/defense-schedule/create');
  };

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-5">
                <button
                    onClick={() => router.push('/committee/defense-schedule/create')}
                    className="p-3 hover:bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all cursor-pointer bg-gray-50 dark:bg-gray-950 group"
                >
                    <ArrowLeft size={24} className="text-gray-600 dark:text-gray-300 group-hover:text-green-600" />
                </button>
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight">Select Research Groups</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1 uppercase tracking-widest flex items-center">
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded mr-2">Targeting: {defenseType}</span>
                        Available for assignment
                    </p>
                </div>
            </div>

            <button
                onClick={handleAddGroups}
                className="inline-flex items-center px-8 py-4 border border-transparent text-sm font-black rounded-2xl shadow-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:scale-[1.02] active:scale-100"
            >
                <CheckCircle size={20} className="mr-2" />
                Assign {selectedGroups.length} Selected Groups
            </button>
        </div>

        <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-gray-950/50">
                        <tr>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest w-16">Select</th>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Student Credentials</th>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Project Particulars</th>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Supervision Panel</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-50">
                        {availableProposals && availableProposals.length > 0 ? (
                            availableProposals.map((proposal: any) => (
                                <tr 
                                    key={proposal._id} 
                                    className={`hover:bg-green-50/20 transition-all group cursor-pointer ${selectedGroups.includes(proposal._id) ? 'bg-green-50/40' : ''}`}
                                    onClick={() => handleCheckboxChange(proposal._id)}
                                >
                                    <td className="px-8 py-6">
                                        <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${selectedGroups.includes(proposal._id) ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-100' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'}`}>
                                            {selectedGroups.includes(proposal._id) && <CheckCircle2 size={20} />}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1.5">
                                            {proposal.members.map((m: any) => (
                                                <div key={m.studentId} className="flex items-center">
                                                    <span className="text-[10px] font-black bg-gray-100 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-md mr-2 font-mono">{m.studentId}</span>
                                                    <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{m.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-blue-50 p-2 rounded-lg text-blue-500 mt-1">
                                                <BookOpen size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900 dark:text-gray-50 mb-1 leading-tight group-hover:text-green-700 transition-colors">{proposal.title}</p>
                                                <span className="inline-block bg-gray-100 text-gray-500 dark:text-gray-400 rounded text-[9px] px-1.5 font-black uppercase tracking-tighter">
                                                    {proposal.type}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-2">
                                            <div className="flex items-center text-[11px] font-bold text-gray-500 dark:text-gray-400">
                                                <UserCheck size={14} className="mr-2 text-green-500" />
                                                <span className="mr-1 opacity-60 uppercase text-[9px]">Supervisor:</span>
                                                <span className="text-gray-900 dark:text-gray-50">{proposal.supervisorId.name}</span>
                                            </div>
                                            {proposal.courseSupervisorId && (
                                                <div className="flex items-center text-[11px] font-bold text-gray-500 dark:text-gray-400">
                                                    <Users size={14} className="mr-2 text-blue-500" />
                                                    <span className="mr-1 opacity-60 uppercase text-[9px]">Course:</span>
                                                    <span className="text-gray-900 dark:text-gray-50">{proposal.courseSupervisorId.name}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-20 text-center text-gray-400 font-bold italic">
                                    No available proposals found for {defenseType} phase.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CommitteeSelectGroupsPage;
