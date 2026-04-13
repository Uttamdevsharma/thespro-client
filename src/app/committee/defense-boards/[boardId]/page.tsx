'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetDefenseBoardByIdQuery } from '@/store/features/apiSlice';
import Loader from '@/components/Loader';
import { format } from 'date-fns';
import { ArrowLeft, FileText, Info, Users, MapPin, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

const CommitteeDefenseBoardDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const boardId = params.boardId as string;

  const { data: boardDetails, isLoading, isError, error } = useGetDefenseBoardByIdQuery(boardId);

  if (isLoading) return <Loader />;
  if (isError) return <div className="p-10 text-center text-red-500 font-bold bg-red-50 rounded-2xl border border-red-100 max-w-6xl mx-auto mt-10">Error: {(error as any)?.data?.message || (error as any)?.error}</div>;
  if (!boardDetails) return <div className="p-20 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 max-w-6xl mx-auto mt-10 text-gray-400 font-bold italic">No board details found.</div>;

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-5 mb-10">
            <button
                onClick={() => router.push('/committee/defense-boards')}
                className="p-3 hover:bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all cursor-pointer bg-gray-50 dark:bg-gray-950 group"
            >
                <ArrowLeft size={24} className="text-gray-600 dark:text-gray-300 group-hover:text-green-600" />
            </button>
            <div>
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight">
                    Defense Board #{boardDetails.boardNumber} <span className="text-green-600">({boardDetails.defenseType})</span>
                </h2>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Detailed board composition and assigned groups</p>
            </div>
        </div>

        <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-3xl p-8 mb-12 border border-blue-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Info size={120} className="text-blue-500" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="space-y-1">
                    <p className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        <Calendar size={14} className="mr-1 text-green-500" /> Event Date
                    </p>
                    <p className="text-lg font-extrabold text-gray-800 dark:text-gray-100">{boardDetails.date ? format(new Date(boardDetails.date), 'PPP') : 'N/A'}</p>
                </div>
                <div className="space-y-1">
                    <p className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        <Clock size={14} className="mr-1 text-blue-500" /> Time Window
                    </p>
                    <p className="text-lg font-extrabold text-gray-800 dark:text-gray-100">
                        {boardDetails.schedule?.startTime && boardDetails.schedule?.endTime
                            ? `${boardDetails.schedule.startTime} - ${boardDetails.schedule.endTime}`
                            : 'N/A'}
                    </p>
                </div>
                <div className="space-y-1">
                    <p className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        <MapPin size={14} className="mr-1 text-red-500" /> Assigned Venue
                    </p>
                    <p className="text-lg font-extrabold text-gray-800 dark:text-gray-100 uppercase tracking-tight">{boardDetails.room?.name || 'N/A'}</p>
                </div>
                <div className="space-y-1 lg:col-span-1">
                    <p className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        <Users size={14} className="mr-1 text-purple-500" /> Board Members
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {boardDetails.boardMembers && boardDetails.boardMembers.length > 0
                            ? boardDetails.boardMembers.map((member: any) => (
                                <span key={member._id} className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-bold border border-purple-100 italic">
                                    {member.name}
                                </span>
                            ))
                            : <span className="text-gray-400 font-bold italic">No members assigned</span>}
                    </div>
                </div>
            </div>
        </div>

        <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-black text-gray-900 dark:text-gray-50 tracking-tight flex items-center">
                <Users className="mr-2 text-green-500" size={24} /> Assigned Groups List
            </h3>
            <span className="bg-gray-100 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-black">{boardDetails.groups?.length || 0} Groups Assigned</span>
        </div>

        {boardDetails.groups && boardDetails.groups.length > 0 ? (
          <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-8 py-4 text-left text-[10px] font-black text-gray-800 dark:text-gray-100 uppercase tracking-widest">Serial</th>
                    <th className="px-8 py-4 text-left text-[10px] font-black text-gray-800 dark:text-gray-100 uppercase tracking-widest">Research Group & Members</th>
                    <th className="px-8 py-4 text-left text-[10px] font-black text-gray-800 dark:text-gray-100 uppercase tracking-widest">Supervision Panel</th>
                    <th className="px-8 py-4 text-right text-[10px] font-black text-gray-800 dark:text-gray-100 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-50">
                  {boardDetails.groups.map((group: any, index: number) => (
                    <tr key={group._id} className="hover:bg-green-50/20 transition-all group">
                      <td className="px-8 py-6 text-sm font-black text-gray-500 dark:text-gray-400">{index + 1 < 10 ? `0${index + 1}` : index + 1}</td>
                      <td className="px-8 py-6">
                        <div className="mb-2">
                           <span className="text-sm font-black text-gray-900 dark:text-gray-50 group-hover:text-green-700 transition-colors uppercase tracking-tight">{group.title}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {group.members.map((member: any) => (
                                <span key={member.studentId} className="bg-gray-100 text-gray-700 dark:text-gray-200 px-2 py-0.5 rounded text-[10px] font-black border border-gray-200 dark:border-gray-700 shadow-sm">
                                    {member.name} ({member.studentId})
                                </span>
                            ))}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1.5">
                            <div className="flex items-center text-xs font-black text-gray-900 dark:text-gray-50">
                                <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                                <span className="text-gray-500 dark:text-gray-400 mr-2 uppercase text-[9px] font-black">Supervisor:</span>
                                {group.supervisorId?.name || 'N/A'}
                            </div>
                            <div className="flex items-center text-xs font-black text-gray-900 dark:text-gray-50">
                                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                                <span className="text-gray-500 dark:text-gray-400 mr-2 uppercase text-[9px] font-black">Course:</span>
                                {group.courseSupervisorId?.name || 'N/A'}
                            </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Link
                          href={`/committee/defense-boards/${boardId}/group-result/${group._id}?defenseType=${boardDetails.defenseType}`}
                          className="inline-flex items-center px-4 py-2.5 bg-white dark:bg-gray-900 text-green-700 rounded-xl text-xs font-black border-2 border-green-600 shadow-md hover:bg-green-600 hover:text-white transition-all transform active:scale-95"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Evaluation History
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-20 text-center bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-gray-400 text-lg font-bold italic">No groups have been attached to this deployment yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommitteeDefenseBoardDetailPage;
