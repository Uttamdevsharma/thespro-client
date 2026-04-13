'use client';

import React, { useState, useEffect } from 'react';
import { useGetSupervisorDefenseScheduleQuery, useAddOrUpdateCommentMutation } from '@/store/features/apiSlice';
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';
import { Save, Filter, Users, Calendar, MapPin, Clock } from 'lucide-react';

const SupervisorDefenseSchedulePage = () => {
  const [defenseTypeFilter, setDefenseTypeFilter] = useState('Pre-Defense');
  const { data: defenseBoards, isLoading, isError, error, refetch } = useGetSupervisorDefenseScheduleQuery(defenseTypeFilter);
  const [addOrUpdateComment] = useAddOrUpdateCommentMutation();
  const [comments, setComments] = useState<Record<string, string>>({});

  useEffect(() => {
    if (defenseBoards) {
      const initialComments: Record<string, string> = {};
      defenseBoards.forEach((board: any) => {
        board.groups.forEach((group: any) => {
          const existingComment = board.comments.find((c: any) => c.group === group._id);
          initialComments[group._id] = existingComment ? existingComment.text : '';
        });
      });
      setComments(initialComments);
    }
  }, [defenseBoards]);

  const handleChangeComment = (groupId: string, text: string) => {
    setComments(prev => ({ ...prev, [groupId]: text }));
  };

  const handleSaveComment = async (defenseBoardId: string, groupId: string) => {
    try {
      await addOrUpdateComment({ id: defenseBoardId, groupId, text: comments[groupId] }).unwrap();
      toast.success('Comment saved successfully!');
      refetch();
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to save comment.');
    }
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 mb-8 flex items-center">
            <Calendar className="mr-3 text-green-600" size={32} />
            Defense Schedule
        </h1>

        {/* Filter Section */}
        <div className="mb-8 max-w-sm bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <label htmlFor="defenseTypeFilter" className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2 flex items-center">
            <Filter size={16} className="mr-2" /> Filter by Defense Type
          </label>
          <select
            id="defenseTypeFilter"
            value={defenseTypeFilter}
            onChange={(e) => setDefenseTypeFilter(e.target.value)}
            className="block w-full bg-white dark:bg-gray-900 border border-gray-300 rounded-lg py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 transition-all font-semibold"
          >
            <option value="Pre-Defense">Pre-Defense</option>
            <option value="Final Defense">Final Defense</option>
          </select>
        </div>

        {isLoading ? (
          <Loader />
        ) : isError ? (
          <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium">
            Error: {(error as any)?.data?.message || 'An unexpected error occurred'}
          </div>
        ) : (
          <div className="space-y-10">
            {defenseBoards && defenseBoards.length > 0 ? (
              (defenseBoards as any[]).map(board => (
                <div key={board._id} className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 transition-all hover:shadow-2xl">
                  {/* Board Header Info */}
                  <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
                        <div className="flex items-center">
                            <div className="bg-green-100 p-2 rounded-lg mr-3 text-green-700 font-bold">
                                {board.boardNumber}
                            </div>
                            <span className="text-gray-500 dark:text-gray-400 font-medium">Board Number</span>
                        </div>
                        <div className="flex items-center">
                            <Calendar size={18} className="text-blue-500 mr-2" />
                            <span className="text-gray-700 dark:text-gray-200 font-semibold">{new Date(board.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                        </div>
                        <div className="flex items-center">
                            <MapPin size={18} className="text-red-500 mr-2" />
                            <span className="text-gray-700 dark:text-gray-200 font-semibold">{board.room?.name || 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                            <Clock size={18} className="text-purple-500 mr-2" />
                            <span className="text-gray-700 dark:text-gray-200 font-semibold">{board.schedule ? `${board.schedule.startTime} - ${board.schedule.endTime}` : 'N/A'}</span>
                        </div>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-black text-gray-900 dark:text-gray-50 uppercase tracking-wider">Sl.</th>
                          <th className="px-6 py-4 text-left text-xs font-black text-gray-900 dark:text-gray-50 uppercase tracking-wider">Group Details</th>
                          <th className="px-6 py-4 text-left text-xs font-black text-gray-900 dark:text-gray-50 uppercase tracking-wider">Supervisors</th>
                          <th className="px-6 py-4 text-left text-xs font-black text-gray-900 dark:text-gray-50 uppercase tracking-wider w-1/3">Comments</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200">
                        {board.groups.map((group: any, index: number) => (
                          <tr key={group._id} className="hover:bg-gray-50 dark:bg-gray-950 transition-colors">
                            <td className="px-6 py-4 text-sm font-black text-gray-900 dark:text-gray-50">{index + 1}</td>

                            <td className="px-6 py-4">
                                <div className="text-sm font-black text-gray-900 dark:text-gray-50 mb-2">{group.title}</div>
                                <div className="flex flex-col gap-1">
                                    {group.members.map((m: any) => (
                                        <div key={m.studentId} className="flex items-center text-xs text-gray-900 dark:text-gray-50">
                                            <span className="bg-gray-100 px-1.5 py-0.5 rounded mr-2 font-mono font-bold">{m.studentId}</span>
                                            <span className="font-semibold">{m.name}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-2">
                                    <span className="inline-block bg-blue-100 text-blue-900 rounded-full px-2 py-0.5 text-[10px] font-black uppercase">
                                        {group.type}
                                    </span>
                                </div>
                            </td>

                            <td className="px-6 py-4 text-sm">
                                <div className="mb-2">
                                    <p className="text-[10px] text-gray-600 dark:text-gray-300 uppercase font-black">Supervisor</p>
                                    <p className="font-bold text-gray-900 dark:text-gray-50">{group.supervisorId?.name || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-600 dark:text-gray-300 uppercase font-black">Course Supervisor</p>
                                    <p className="font-bold text-gray-900 dark:text-gray-50">{group.courseSupervisorId?.name || '-'}</p>
                                </div>
                            </td>

                            <td className="px-6 py-4">
                                <div className="bg-gray-50 dark:bg-gray-950 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <textarea
                                      className="w-full p-3 border border-gray-300 rounded-lg text-sm font-medium resize-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50"
                                      rows={2}
                                      value={comments[group._id] || ''}
                                      onChange={(e) => handleChangeComment(group._id, e.target.value)}
                                      placeholder="Add board comment..."
                                    />
                                    <button
                                      onClick={() => handleSaveComment(board._id, group._id)}
                                      className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-black flex items-center justify-center shadow-md transition-all active:scale-95"
                                    >
                                      <Save size={14} className="mr-2" /> Save Comment
                                    </button>
                                </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Board Members Footer */}
                  <div className="bg-gray-50 dark:bg-gray-950 p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm">
                        <Users size={18} className="mr-2 text-gray-400" />
                        <span className="font-semibold mr-2">Board Members:</span>
                        <span className="font-medium">{board.boardMembers.map((m: any) => m.name).join(', ')}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-20 text-center bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-gray-400 text-lg font-medium">No {defenseTypeFilter.toLowerCase()} boards have been created yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupervisorDefenseSchedulePage;
