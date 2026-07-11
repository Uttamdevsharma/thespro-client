'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetTeachersQuery } from '@/store/features/apiSlice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setBoardDraft } from '@/store/features/boardDraftSlice';
import toast from 'react-hot-toast';
import PageSkeleton from '@/components/PageSkeleton';
import { ArrowLeft, CheckCircle2, User, Mail, FlaskConical, CheckCircle } from 'lucide-react';

const CommitteeSelectMembersPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const boardDraft = useSelector((state: RootState) => state.boardDraft);
  const { data: supervisors, isLoading } = useGetTeachersQuery();

  const [selectedMembers, setSelectedMembers] = useState<string[]>(boardDraft?.boardMembers || []);

  const handleCheckboxChange = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const handleAddMembers = () => {
    if (selectedMembers.length === 0) {
      toast.error('Please select at least one member.');
      return;
    }
    dispatch(setBoardDraft({ boardMembers: selectedMembers }));
    toast.success('Board members updated in draft.');
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
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight">Select Jury Members</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Designate faculty members for the defense board</p>
                </div>
            </div>

            <button
                onClick={handleAddMembers}
                className="inline-flex items-center px-8 py-4 border border-transparent text-sm font-black rounded-2xl shadow-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:scale-[1.02] active:scale-100"
            >
                <CheckCircle size={20} className="mr-2" />
                Assign {selectedMembers.length} Selected Members
            </button>
        </div>

        <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-gray-950/50">
                        <tr>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest w-16">Select</th>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Faculty Member</th>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Communication</th>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Specialization</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-50">
                        {supervisors && supervisors.length > 0 ? (
                            supervisors.map((supervisor: any) => (
                                <tr 
                                    key={supervisor._id} 
                                    className={`hover:bg-green-50/20 transition-all group cursor-pointer ${selectedMembers.includes(supervisor._id) ? 'bg-green-50/40' : ''}`}
                                    onClick={() => handleCheckboxChange(supervisor._id)}
                                >
                                    <td className="px-8 py-6">
                                        <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${selectedMembers.includes(supervisor._id) ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-100' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'}`}>
                                            {selectedMembers.includes(supervisor._id) && <CheckCircle2 size={20} />}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-green-100 text-green-600 p-2 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-all">
                                                <User size={18} />
                                            </div>
                                            <span className="text-sm font-black text-gray-900 dark:text-gray-50 group-hover:text-green-700 transition-colors uppercase tracking-tight">{supervisor.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center text-sm font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-950 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-800 group-hover:bg-white dark:bg-gray-900 transition-all">
                                            <Mail size={14} className="mr-2 text-blue-400" />
                                            {supervisor.email}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center text-[11px] font-black text-gray-400 uppercase tracking-tighter">
                                            <FlaskConical size={14} className="mr-2 text-purple-400" />
                                            {supervisor.researchCell?.title || (supervisor.researchCells?.length > 0 ? supervisor.researchCells[0].title : 'Unassigned')}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-20 text-center text-gray-400 font-bold italic">
                                    No faculty members detected in system.
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

export default CommitteeSelectMembersPage;
