'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import toast from 'react-hot-toast';
import {
  useGetSupervisorSentNoticesQuery,
  useSendNoticeToGroupMutation,
  useGetProposalsBySupervisorQuery
} from '@/store/features/apiSlice';
import Loader from '@/components/Loader';

const SupervisorNoticePage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [selectedProposalId, setSelectedProposalId] = useState('');
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeDescription, setNoticeDescription] = useState('');
  const [currentFilter, setCurrentFilter] = useState('my_supervision');

  const { data: proposals, isLoading: proposalsLoading } = useGetProposalsBySupervisorQuery(
    { supervisorId: (user as any)?._id, filter: currentFilter }, 
    { skip: !user }
  );
  const { data: sentNotices, isLoading: noticesLoading, refetch } = useGetSupervisorSentNoticesQuery();
  const [sendNoticeToGroup] = useSendNoticeToGroupMutation();

  const handleSubmitNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProposalId || !noticeTitle || !noticeDescription) {
      toast.error('Please fill all fields.');
      return;
    }

    try {
      await sendNoticeToGroup({ groupId: selectedProposalId, title: noticeTitle, description: noticeDescription }).unwrap();
      toast.success('Notice Sent Successfully!');
      setSelectedProposalId('');
      setNoticeTitle('');
      setNoticeDescription('');
      refetch();
    } catch (error: any) {
      console.error("Error sending notice: ", error);
      toast.error(`Failed to send notice: ${error.data?.message || error.message}`);
    }
  };

  if (proposalsLoading || noticesLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="bg-white w-full max-w-2xl shadow-xl rounded-2xl p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-8">
          📢 Send Notice to Student Group
        </h1>

        <form onSubmit={handleSubmitNotice} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="filterGroups" className="block text-gray-700 font-semibold mb-2">
                Filter Groups
              </label>
              <select
                id="filterGroups"
                value={currentFilter}
                onChange={(e) => setCurrentFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none text-gray-700"
              >
                <option value="my_supervision">Under My Supervision</option>
                <option value="my_supervision_with_course_supervision">Under My Supervision with Course Supervision</option>
                <option value="my_course_supervision">Under My Course Supervision</option>
              </select>
            </div>

            <div>
              <label htmlFor="selectGroup" className="block text-gray-700 font-semibold mb-2">
                Select Group
              </label>
              <select
                id="selectGroup"
                value={selectedProposalId}
                onChange={(e) => setSelectedProposalId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none text-gray-700"
                required
              >
                <option value="">-- Select a Proposal or Group --</option>
                <option value="all">All Groups</option>
                {proposals?.map((proposal: any) => (
                  <option key={proposal._id} value={proposal._id}>
                    {proposal.title} ({proposal.members.length} Members)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="noticeTitle" className="block text-gray-700 font-semibold mb-2">
              Notice Title
            </label>
            <input
              type="text"
              id="noticeTitle"
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
              placeholder="Enter notice title..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none text-gray-700"
              required
            />
          </div>

          <div>
            <label htmlFor="noticeDescription" className="block text-gray-700 font-semibold mb-2">
              Notice Description
            </label>
            <textarea
              id="noticeDescription"
              value={noticeDescription}
              onChange={(e) => setNoticeDescription(e.target.value)}
              rows={5}
              placeholder="Write your notice message here..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none text-gray-700"
              required
            ></textarea>
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-100"
            >
              Send Notice
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white w-full max-w-2xl mt-12 shadow-lg rounded-2xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">📄 Sent Notices</h2>
        {sentNotices && sentNotices.length > 0 ? (
          <div className="space-y-6">
            {sentNotices.map((notice: any) => (
              <div key={notice._id} className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all">
                <h3 className="text-lg font-bold text-green-700 mb-1">{notice.title}</h3>
                <p className="text-gray-700 text-sm mb-3 leading-relaxed">{notice.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
                  <span>Sent to {notice.recipients.length} users</span>
                  <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-10">No notices sent yet.</p>
        )}
      </div>
    </div>
  );
};

export default SupervisorNoticePage;
