'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useGetAllDefenseBoardsQuery, useDeleteDefenseBoardMutation } from '@/store/features/apiSlice';
import Loader from '@/components/Loader';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Eye, Trash2, Calendar, Clock, MapPin, Layers } from 'lucide-react';

const CommitteeAllDefenseBoardsPage = () => {
  const router = useRouter();
  const { data: defenseBoards, isLoading, isError, error, refetch } = useGetAllDefenseBoardsQuery();
  const [deleteDefenseBoard] = useDeleteDefenseBoardMutation();

  const handleDelete = async (boardId: string) => {
    if (window.confirm('Are you sure you want to delete this defense board? This action cannot be undone.')) {
      try {
        await deleteDefenseBoard(boardId).unwrap();
        toast.success('Defense board deleted successfully.');
        refetch();
      } catch (err: any) {
        toast.error(err?.data?.message || err.error || 'Failed to delete board');
      }
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return <div className="p-10 text-center text-red-500 font-bold bg-red-50 rounded-2xl border border-red-100 max-w-6xl mx-auto mt-10">Error: {(error as any)?.data?.message || (error as any)?.error}</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-10 flex items-center">
            <Layers className="mr-3 text-green-600" size={32} />
            Departmental Defense Boards
        </h1>

        {defenseBoards && defenseBoards.length > 0 ? (
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th scope="col" className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Designation
                    </th>
                    <th scope="col" className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                      Type
                    </th>
                    <th scope="col" className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                      Event Schedule
                    </th>
                    <th scope="col" className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                      Venue
                    </th>
                    <th scope="col" className="px-8 py-5 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Admin Controls
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                  {defenseBoards.map((board: any) => (
                    <tr key={board._id} className="hover:bg-green-50/20 transition-all group">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-100 text-green-700 flex items-center justify-center rounded-xl font-black mr-4 text-lg border border-green-200 shadow-sm transition-all group-hover:scale-110 group-hover:bg-green-600 group-hover:text-white">
                                {board.boardNumber}
                            </div>
                            <span className="font-bold text-gray-800 tracking-tight">Board ID #{board.boardNumber}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-center">
                        <span className="inline-block bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border border-blue-100">
                            {board.defenseType}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-center">
                        <div className="flex flex-col items-center">
                            <div className="flex items-center text-sm font-bold text-gray-700 space-x-2">
                                <Calendar size={14} className="text-gray-400" />
                                <span>{board.date ? format(new Date(board.date), 'PPP') : 'N/A'}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-400 font-medium mt-1">
                                <Clock size={12} className="mr-1" />
                                <span>{board.schedule?.startTime && board.schedule?.endTime ? `${board.schedule.startTime} - ${board.schedule.endTime}` : 'N/A'}</span>
                            </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-center">
                        <div className="inline-flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 group-hover:bg-white transition-all">
                            <MapPin size={14} className="text-red-400" />
                            <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors uppercase tracking-tight">{board.room?.name || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-right">
                        <div className="flex justify-end items-center space-x-4">
                            <button
                                onClick={() => router.push(`/committee/defense-boards/${board._id}`)}
                                className="inline-flex items-center px-4 py-2 bg-white text-green-600 border border-green-200 rounded-xl text-xs font-bold shadow-sm hover:bg-green-600 hover:text-white hover:border-green-600 transition-all active:scale-95"
                                title="View Board Details"
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                Detail View
                            </button>
                            <button
                                onClick={() => handleDelete(board._id)}
                                className="inline-flex items-center p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all active:rotate-12"
                                title="Delete Board record"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
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
            <p className="text-gray-400 text-xl font-bold italic">No active defense boards detected.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommitteeAllDefenseBoardsPage;
