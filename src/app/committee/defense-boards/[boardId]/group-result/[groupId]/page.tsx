'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useGetEvaluationsByProposalQuery } from '@/store/features/apiSlice';
import Loader from '@/components/Loader';
import { ArrowLeft, FileText, User, UserCheck, ShieldCheck, TrendingUp } from 'lucide-react';

const CommitteeGroupResultSummaryPage = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const boardId = params.boardId as string;
  const proposalId = params.groupId as string;
  const defenseType = searchParams.get('defenseType') || 'Pre-Defense';

  const { data: evaluations, isLoading, isError, error } = useGetEvaluationsByProposalQuery({ proposalId, defenseType });

  const summarizedResults = useMemo(() => {
    if (!evaluations) return [];

    const results: any = {};
    (evaluations as any[]).forEach(studentResult => {
      const student = studentResult.student;
      results[student._id] = {
        name: student.name,
        studentId: student.studentId,
        supervisorMark: 'N/A',
        committeeMark: 0,
        committeeCount: 0,
        totalScore: 0,
        supervisorName: 'N/A',
      };

      studentResult.evaluations.forEach((evalItem: any) => {
        if (evalItem.evaluationType === 'supervisor') {
          results[student._id].supervisorMark = evalItem.marks;
        } else if (evalItem.evaluationType === 'committee') {
          results[student._id].committeeMark += evalItem.marks;
          results[student._id].committeeCount += 1;
        }
      });
    });

    return Object.values(results).map((student: any) => {
      const avgCommitteeMark = student.committeeCount > 0 ? (student.committeeMark / student.committeeCount) : 0;
      const total = (typeof student.supervisorMark === 'number' ? student.supervisorMark : 0) + avgCommitteeMark;
      return {
        ...student,
        avgCommitteeMark: parseFloat(avgCommitteeMark.toFixed(2)),
        totalScore: parseFloat(total.toFixed(2)),
      };
    });
  }, [evaluations]);

  if (isLoading) return <Loader />;
  if (isError) return (
    <div className="p-10 text-center text-red-500 font-bold bg-red-50 rounded-2xl border border-red-100 max-w-6xl mx-auto mt-10">
        Error: {(error as any)?.data?.message || (error as any)?.error}
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-5 mb-10">
            <button
                onClick={() => router.push(`/committee/defense-boards/${boardId}`)}
                className="p-3 hover:bg-white rounded-xl border border-gray-200 shadow-sm transition-all cursor-pointer bg-gray-50 group"
            >
                <ArrowLeft size={24} className="text-gray-600 group-hover:text-green-600" />
            </button>
            <div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Unit Evaluation Summary <span className="text-green-600 capitalize">({defenseType.replace('-', ' ')})</span>
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-widest">Aggregate score breakdown for assigned unit</p>
            </div>
        </div>

        {summarizedResults.length > 0 ? (
          <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100 relative">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <TrendingUp size={120} className="text-green-500" />
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100 pb-8">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Candidate</th>
                    <th className="px-8 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Internal Credit</th>
                    <th className="px-8 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Board Average</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Valuation</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                  {summarizedResults.map((student: any) => (
                    <tr key={student.studentId} className="hover:bg-green-50/20 transition-all group">
                        <td className="px-8 py-6 whitespace-nowrap">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-green-100 text-green-700 flex items-center justify-center rounded-xl font-black shadow-sm group-hover:bg-green-600 group-hover:text-white transition-all">
                                    {student.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-extrabold text-gray-800 group-hover:text-green-700 transition-colors uppercase tracking-tight">{student.name}</p>
                                    <p className="text-[10px] font-black text-gray-400 font-mono tracking-tighter">{student.studentId}</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                            <div className="inline-flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 group-hover:bg-white transition-all">
                                <UserCheck size={14} className="text-blue-400" />
                                <span className="text-sm font-black text-gray-700">{student.supervisorMark}</span>
                            </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                            <div className="inline-flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 group-hover:bg-white transition-all">
                                <ShieldCheck size={14} className="text-purple-400" />
                                <span className="text-sm font-black text-gray-700">{student.avgCommitteeMark}</span>
                            </div>
                        </td>
                        <td className="px-8 py-6 text-right whitespace-nowrap">
                            <div className="flex flex-col items-end">
                                <span className="text-2xl font-black text-green-600 tabular-nums tracking-tighter group-hover:scale-110 transition-transform origin-right">{student.totalScore}</span>
                                <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">points earned</span>
                            </div>
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-24 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
             <FileText size={48} className="mx-auto text-gray-200 mb-4" />
             <p className="text-gray-400 text-lg font-bold italic">No evaluation analytics detected for this deployment phase.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommitteeGroupResultSummaryPage;
