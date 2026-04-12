'use client';

import React, { useEffect, useState } from 'react';
import { useGetStudentDefenseScheduleQuery } from '@/store/features/apiSlice';
import { useSocket } from '@/contexts/SocketContext';
import Loader from '@/components/Loader';

const StudentDefenseSchedulePage = () => {
  const [defenseTypeFilter, setDefenseTypeFilter] = useState('Pre-Defense'); 
  const { data: defenseBoards, isLoading, isError, error, refetch } = useGetStudentDefenseScheduleQuery(defenseTypeFilter);
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('commentUpdated', () => {
        refetch();
      });
      return () => {
        socket.off('commentUpdated');
      };
    }
  }, [socket, refetch]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Defense Schedule</h1>

      {/* Filter */}
      <div className="mb-6 max-w-sm bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <label htmlFor="defenseTypeFilter" className="block text-sm font-medium text-gray-700 mb-1">
          Filter by Defense Type:
        </label>
        <select
          id="defenseTypeFilter"
          value={defenseTypeFilter}
          onChange={(e) => setDefenseTypeFilter(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#50C878] focus:ring focus:ring-[#50C878] focus:ring-opacity-50 p-2 text-gray-700"
        >
          <option value="Pre-Defense">Pre-Defense</option>
          <option value="Final Defense">Final Defense</option>
        </select>
      </div>

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <p className="text-red-500">Error: {(error as any)?.data?.message || 'An unexpected error occurred'}</p>
      ) : (
        <div className="space-y-6">
          {defenseBoards && defenseBoards.length > 0 ? defenseBoards.map((board: any) => (
            <div key={board._id} className="p-4 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              
              {/* Board Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 text-sm text-gray-600">
                <div className="mb-2 sm:mb-0">
                  <span className="font-semibold">Board:</span> {board.boardNumber} |{' '}
                  <span className="font-semibold">Date:</span> {new Date(board.date).toLocaleDateString()} |{' '}
                  <span className="font-semibold">Room:</span> {board.room?.name || 'N/A'} |{' '}
                  <span className="font-semibold">Schedule:</span> {board.schedule ? `${board.schedule.startTime} - ${board.schedule.endTime}` : 'N/A'}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-black text-gray-900 uppercase tracking-wider">Sl.</th>
                      <th className="py-3 px-4 text-left text-xs font-black text-gray-900 uppercase tracking-wider">Student IDs</th>
                      <th className="py-3 px-4 text-left text-xs font-black text-gray-900 uppercase tracking-wider">Student Names</th>
                      <th className="py-3 px-4 text-left text-xs font-black text-gray-900 uppercase tracking-wider">Thesis/Project Title</th>
                      <th className="py-3 px-4 text-left text-xs font-black text-gray-900 uppercase tracking-wider">Type</th>
                      <th className="py-3 px-4 text-left text-xs font-black text-gray-900 uppercase tracking-wider">Supervisor</th>
                      <th className="py-3 px-4 text-left text-xs font-black text-gray-900 uppercase tracking-wider">Course Supervisor</th>
                      <th className="py-3 px-4 text-left text-xs font-black text-gray-900 uppercase tracking-wider">Comments</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {board.groups.map((group: any, index: number) => (
                      <tr key={group._id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-sm font-bold text-gray-900">{index + 1}</td>

                        {/* Student IDs and Names aligned */}
                        <td className="py-3 px-4 text-sm">
                          <div className="flex flex-col gap-1">
                            {group.members.map((m: any, i: number) => (
                              <span key={i} className="font-mono font-bold text-gray-900 whitespace-nowrap bg-gray-50 px-1 rounded">{m.studentId}</span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex flex-col gap-1">
                            {group.members.map((m: any, i: number) => (
                              <span key={i} className="font-semibold text-gray-900 whitespace-nowrap">{m.name || 'N/A'}</span>
                            ))}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-sm font-bold text-gray-900">{group.title}</td>
                        <td className="py-3 px-4 text-sm">
                            <span className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                                {group.type}
                            </span>
                        </td>
                        <td className="py-3 px-4 text-sm font-semibold text-gray-900">{group.supervisorId?.name || '-'}</td>
                        <td className="py-3 px-4 text-sm font-semibold text-gray-900">{group.courseSupervisorId?.name || '-'}</td>

                        {/* Comments */}
                        <td className="py-3 px-4 text-sm" style={{ whiteSpace: 'pre-wrap' }}>
                          {board.comments.filter((c: any) => c.group === group._id).map((comment: any, i: number) => (
                            <div key={i} className="mb-2 p-2 bg-gray-50 rounded border border-gray-100">
                              <strong className="text-blue-900 block text-[10px] uppercase font-black">{comment.commentedBy?.name || 'Unknown'}:</strong> 
                              <span className="text-gray-900 font-medium">{comment.text}</span>
                            </div>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Board Members */}
              <div className="text-gray-700 font-semibold text-center mt-3">
                Board Members: {board.boardMembers.map((m: any) => m.name).join(', ')}
              </div>
            </div>
          )) : (
            <p className="text-gray-500 text-center py-10 bg-white rounded-lg border border-dashed">No {defenseTypeFilter.toLowerCase()} boards available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentDefenseSchedulePage;
