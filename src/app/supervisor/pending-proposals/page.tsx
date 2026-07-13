'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import toast from 'react-hot-toast';
import { useCycle } from '@/contexts/CycleContext';
import { useUpdateProposalStatusMutation, useGetSupervisorPendingProposalsQuery } from '@/store/features/apiSlice';
import Skeleton from '@/components/Skeleton';
import { ProposalListSkeleton } from '@/components/ProposalSkeleton';
import { ChevronDown, ChevronUp, Check, X, MessageSquare, Loader2 } from 'lucide-react';

const SupervisorPendingProposalsPage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const { cycleId } = useCycle();
  const { data: proposals, isLoading, isError, error } = useGetSupervisorPendingProposalsQuery({ thesisCycleId: cycleId || undefined }, {
      skip: !user
  });
  const [expandedProposalId, setExpandedProposalId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [showFeedbackInputFor, setShowFeedbackInputFor] = useState<string | null>(null);
  const [showAcceptanceModalFor, setShowAcceptanceModalFor] = useState<string | null>(null);
  const [acceptanceOption, setAcceptanceOption] = useState('supervisor_only');

  const [updateProposalStatus, { isLoading: isUpdating }] = useUpdateProposalStatusMutation();

  const allProposals = (proposals as any[]) || [];
  const actionableProposals = allProposals.filter(p => p.status === 'Pending Supervisor');
  const awaitingProposals = allProposals.filter(p => p.status === 'Pending Committee');

  const handleStatusChange = async (proposalId: string, newStatus: string, acceptanceOption?: string) => {
    try {
      await updateProposalStatus({ id: proposalId, status: newStatus, feedback, acceptanceOption }).unwrap();
      if (newStatus === 'Approved') {
        toast.success('Proposal approved successfully and group assigned correctly.');
      } else {
        toast.success(`Proposal ${newStatus} successfully!`);
      }
      setExpandedProposalId(null);
      setFeedback('');
      setShowFeedbackInputFor(null);
      setShowAcceptanceModalFor(null);
    } catch (error: any) {
      console.error(`Error updating proposal status to ${newStatus}: `, error);
      toast.error(`Failed to update proposal status: ${error.data?.message || error.message}`);
    }
  };

  const handleApproveClick = (proposalId: string) => {
    setShowAcceptanceModalFor(proposalId);
  };

  const handleAcceptance = () => {
    if (showAcceptanceModalFor) {
      handleStatusChange(showAcceptanceModalFor, 'Approved', acceptanceOption);
    }
  };

  const renderProposalDetails = (proposal: any, actionable: boolean) => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase font-semibold">Submitted By</p>
              <p className="text-gray-800 dark:text-gray-100 font-medium">{proposal.createdBy.name || 'N/A'} ({proposal.createdBy.studentId})</p>
          </div>
          <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase font-semibold">Thesis Cycle</p>
              <p className="text-gray-800 dark:text-gray-100 font-medium">{proposal.thesisCycle?.name || 'N/A'}</p>
          </div>
          <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase font-semibold">Research Cell</p>
              <p className="text-gray-800 dark:text-gray-100 font-medium">{proposal.researchCellId.title || 'N/A'}</p>
          </div>
      </div>
      
      <div className="mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase font-semibold mb-2">Group Members</p>
          <div className="flex flex-wrap gap-2">
              {proposal.members.map((member: any) => (
                  <span key={member._id} className="inline-block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm">
                      {member.name || 'Unknown'} - {member.studentId} (CGPA: {member.currentCGPA})
                  </span>
              ))}
          </div>
      </div>

      {actionable && (
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => handleApproveClick(proposal._id)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg text-sm flex items-center shadow-md transition-colors"
          >
            <Check size={18} className="mr-2" /> Approve
          </button>
          <button
            onClick={() => setShowFeedbackInputFor(proposal._id)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg text-sm flex items-center shadow-md transition-colors"
          >
            <X size={18} className="mr-2" /> Deny
          </button>
        </div>
      )}

      {showFeedbackInputFor === proposal._id && actionable && (
        <div className="mt-6 p-4 bg-white dark:bg-gray-900 rounded-lg border border-red-100 shadow-inner">
          <label className="block text-sm text-gray-600 dark:text-gray-300 font-medium mb-2 flex items-center">
              <MessageSquare size={16} className="mr-2" /> Denial Feedback:
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-400 focus:border-red-400 sm:text-sm text-gray-700 dark:text-gray-200"
            placeholder="Provide feedback for denial..."
          ></textarea>
          <button
            onClick={() => handleStatusChange(proposal._id, 'Not Approved')}
            disabled={!feedback || isUpdating}
            className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm disabled:bg-gray-400 transition-colors shadow-sm"
          >
            {isUpdating ? 'Updating...' : 'Confirm Deny'}
          </button>
        </div>
      )}
    </>
  );

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-6">
          <Skeleton className="h-8 w-48 mb-6" />
          <ProposalListSkeleton count={4} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-red-100 p-8 text-center">
            <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block mb-4">
                <X size={48} />
            </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Failed to load proposals</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{(error as any)?.data?.message || 'Something went wrong while fetching pending proposals.'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-6 border-b pb-3">Pending Proposals</h1>
        {!allProposals || allProposals.length === 0 ? (
          <div className="p-10 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-950 rounded-lg border border-dashed">
            <p>No pending proposals found.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Actionable Proposals Section */}
            {actionableProposals.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
                  <Check size={20} className="mr-2 text-green-500" /> Action Required
                </h2>
                <div className="space-y-4">
                  {actionableProposals.map((proposal) => (
                    <div key={proposal._id} className="border border-green-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div 
                        className="cursor-pointer hover:bg-green-50 transition-colors p-5 flex justify-between items-center" 
                        onClick={() => setExpandedProposalId(expandedProposalId === proposal._id ? null : proposal._id)}
                      >
                        <div>
                          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{proposal.title || 'Project title here'}</h2>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs font-bold uppercase bg-green-100 text-green-700 px-2 py-0.5 rounded">Actionable</span>
                            <p className="text-green-600 text-sm font-medium">Research Cell: {proposal.researchCellId.title || 'N/A'}</p>
                          </div>
                        </div>
                        {expandedProposalId === proposal._id ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                      </div>

                      {expandedProposalId === proposal._id && (
                        <div className="p-5 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-2 duration-200">
                          {renderProposalDetails(proposal, true)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Awaiting Committee Section */}
            {awaitingProposals.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
                  <Loader2 size={20} className="mr-2 text-blue-500 animate-spin" /> Awaiting Committee Forwarding
                </h2>
                <div className="space-y-4">
                  {awaitingProposals.map((proposal) => (
                    <div key={proposal._id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden opacity-80 shadow-sm">
                      <div 
                        className="cursor-pointer hover:bg-gray-50 dark:bg-gray-950 transition-colors p-5 flex justify-between items-center" 
                        onClick={() => setExpandedProposalId(expandedProposalId === proposal._id ? null : proposal._id)}
                      >
                        <div>
                          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{proposal.title || 'Project title here'}</h2>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs font-bold uppercase bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Pending Committee</span>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Research Cell: {proposal.researchCellId.title || 'N/A'}</p>
                          </div>
                        </div>
                        {expandedProposalId === proposal._id ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                      </div>

                      {expandedProposalId === proposal._id && (
                        <div className="p-5 bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-2 duration-200">
                          {renderProposalDetails(proposal, false)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showAcceptanceModalFor && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl max-w-lg w-full transform transition-all animate-in zoom-in duration-300">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-50 mb-6 flex items-center">
                <span className="bg-green-100 text-green-600 p-2 rounded-lg mr-3"><Check size={24} /></span>
                Acceptance Options
            </h2>
            <div className="space-y-4">
              <label 
                className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${acceptanceOption === 'supervisor_only' ? 'border-green-500 bg-green-50' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950'}`}
                onClick={() => setAcceptanceOption('supervisor_only')}
              >
                <input
                  type="radio"
                  id="supervisor_only"
                  name="acceptanceOption"
                  value="supervisor_only"
                  checked={acceptanceOption === 'supervisor_only'}
                  onChange={() => setAcceptanceOption('supervisor_only')}
                  className="w-5 h-5 text-green-600 focus:ring-green-500"
                />
                <span className="ml-4 font-semibold text-gray-700 dark:text-gray-200">Under my supervision only</span>
              </label>
              <label 
                className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${acceptanceOption === 'supervisor_and_course_supervisor' ? 'border-green-500 bg-green-50' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950'}`}
                onClick={() => setAcceptanceOption('supervisor_and_course_supervisor')}
              >
                <input
                  type="radio"
                  id="supervisor_and_course_supervisor"
                  name="acceptanceOption"
                  value="supervisor_and_course_supervisor"
                  checked={acceptanceOption === 'supervisor_and_course_supervisor'}
                  onChange={() => setAcceptanceOption('supervisor_and_course_supervisor')}
                  className="w-5 h-5 text-green-600 focus:ring-green-500"
                />
                <span className="ml-4 font-semibold text-gray-700 dark:text-gray-200">Under my supervision + assigned course supervisor</span>
              </label>
            </div>
            <div className="mt-8 flex gap-3">
              <button
                onClick={handleAcceptance}
                disabled={isUpdating}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all"
              >
                {isUpdating ? 'Confirming...' : 'Confirm Approval'}
              </button>
              <button
                onClick={() => setShowAcceptanceModalFor(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:text-gray-100 font-bold py-3 px-4 rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupervisorPendingProposalsPage;
