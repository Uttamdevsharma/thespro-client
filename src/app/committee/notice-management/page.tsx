'use client';

import React, { useState } from 'react';
import {
  useCreateCommitteeNoticeMutation,
  useGetCommitteeSentNoticesQuery,
  useDeleteNoticeMutation,
} from '@/store/features/apiSlice';
import toast from 'react-hot-toast';
import PageSkeleton from '@/components/PageSkeleton';
import { Megaphone, Trash2, Send, Users, UserCheck } from 'lucide-react';

const CommitteeNoticeManagementPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sendTo, setSendTo] = useState('all');

  const [createCommitteeNotice, { isLoading: isCreating }] = useCreateCommitteeNoticeMutation();
  const { data: notices, isLoading, refetch } = useGetCommitteeSentNoticesQuery();
  const [deleteNotice, { isLoading: isDeleting }] = useDeleteNoticeMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCommitteeNotice({ title, description, sendTo }).unwrap();
      toast.success('Notice created successfully!');
      setTitle('');
      setDescription('');
      setSendTo('all');
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || err.error || 'Failed to create notice');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await deleteNotice(id).unwrap();
        toast.success('Notice deleted successfully!');
        refetch();
      } catch (err: any) {
        toast.error(err?.data?.message || err.error || 'Failed to delete notice');
      }
    }
  };

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Create Notice Section */}
        <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 border border-gray-100 dark:border-gray-800">
            <h1 className="text-3xl font-extrabold text-center text-green-600 mb-8 flex items-center justify-center">
                <Megaphone className="mr-3" size={32} />
                Notice Management
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-gray-700 dark:text-gray-200 font-bold mb-2">
                        Notice Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Importance: Proposal Submission Deadline"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none text-gray-700 dark:text-gray-200 font-medium"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-gray-700 dark:text-gray-200 font-bold mb-2">
                        Notice Description
                    </label>
                    <textarea
                        id="description"
                        rows={5}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter the details of the announcement..."
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none text-gray-700 dark:text-gray-200 font-medium"
                        required
                    ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div>
                        <label htmlFor="sendTo" className="block text-gray-700 dark:text-gray-200 font-bold mb-2">
                            Send Notice To
                        </label>
                        <select
                            id="sendTo"
                            value={sendTo}
                            onChange={(e) => setSendTo(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none text-gray-700 dark:text-gray-200 font-bold"
                        >
                            <option value="all">Everyone</option>
                            <option value="supervisor">Supervisors Only</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={isCreating}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-100 disabled:bg-gray-400 flex justify-center items-center"
                    >
                        <Send size={20} className="mr-2" />
                        {isCreating ? 'Creating...' : 'Broadcast Notice'}
                    </button>
                </div>
            </form>
        </div>

        {/* Existing Notices Section */}
        <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8 border-b pb-4 flex items-center">
                <span className="bg-green-100 text-green-600 p-2 rounded-lg mr-3"><Send size={20} /></span>
                History of Broadcasted Notices
            </h2>

            {notices && notices.length > 0 ? (
                <div className="space-y-6">
                    {notices.map((notice: any) => (
                        <div
                            key={notice._id}
                            className="p-6 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white dark:bg-gray-900 hover:shadow-md transition-all group"
                        >
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-green-700 mb-2 group-hover:text-green-800">{notice.title}</h3>
                                <p className="text-gray-700 dark:text-gray-200 text-sm mb-4 leading-relaxed">{notice.description}</p>
                                <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <span className="flex items-center"><Users size={14} className="mr-1" /> {notice.recipients.length} Recipients</span>
                                    <span className="flex items-center"><UserCheck size={14} className="mr-1" /> {notice.sender?.name || 'Committee'}</span>
                                    <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(notice._id)}
                                disabled={isDeleting}
                                className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-bold p-3 rounded-xl transition-all disabled:opacity-50"
                                title="Delete Notice"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-20 text-center text-gray-400 italic font-medium">
                    No notices have been broadcasted yet.
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CommitteeNoticeManagementPage;
