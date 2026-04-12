'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useGetPendingProposalsByCellQuery, useForwardProposalMutation, useRejectProposalMutation } from '@/store/features/apiSlice';
import Skeleton from '@/components/Skeleton';
import { ProposalListSkeleton } from '@/components/ProposalSkeleton';
import { ChevronRight, ArrowLeft, Send, XCircle, Info, Users, Layers, AlertCircle } from 'lucide-react';

const CommitteePendingProposalsPage = () => {
  const { data: proposalsByCell, isLoading, isError, error } = useGetPendingProposalsByCellQuery();
  const [forwardProposal, { isLoading: isForwarding }] = useForwardProposalMutation();
  const [rejectProposal, { isLoading: isRejecting }] = useRejectProposalMutation();
  const [selectedCell, setSelectedCell] = useState<any>(null);

  const handleCellClick = (cell: any) => {
    setSelectedCell(cell);
  };

  const handleForward = async (proposalId: string) => {
    try {
      await forwardProposal(proposalId).unwrap();
      toast.success('Proposal forwarded to supervisor!');
      setSelectedCell(null); 
    } catch (error: any) {
      toast.error(`Failed to forward proposal: ${error.data?.message || error.message}`);
    }
  };

  const handleReject = async (proposalId: string) => {
    const feedback = prompt('Enter feedback for rejection:');
    if (!feedback) return toast.error('Feedback is required to reject a proposal.');

    try {
      await rejectProposal({ id: proposalId, feedback }).unwrap();
      toast.success('Proposal rejected!');
      setSelectedCell(null); 
    } catch (error: any) {
      toast.error(`Failed to reject proposal: ${error.data?.message || error.message}`);
    }
  };

  if (isLoading) {
    return (
        <div className="p-8 bg-gray-50 min-h-screen">
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-10 w-80 mb-10" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                        <Skeleton className="h-6 w-3/4 mb-4" />
                        <div className="flex justify-between items-center mt-6">
                            <Skeleton className="h-10 w-24 rounded-xl" />
                            <Skeleton className="h-6 w-6 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </div>
    );
  }

  if (isError) {
    return (
        <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="bg-white p-12 rounded-2xl shadow-xl max-w-lg w-full text-center border border-red-500/20">
                <AlertCircle size={64} className="mx-auto text-red-500 mb-6" />
                <h1 className="text-2xl font-extrabold text-gray-900 mb-3">Fetch Error</h1>
                <p className="text-gray-500 mb-8 italic font-medium">
                    {(error as any)?.data?.message || "Something went wrong while fetching pending proposals."}
                </p>
                <button 
                onClick={() => window.location.reload()}
                className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-xl transition-all"
                >
                Try Again
                </button>
            </div>
        </div>
    );
  }

  if (selectedCell) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
            <button 
                onClick={() => setSelectedCell(null)} 
                className="mb-8 flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 transition-all group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Research Cells
            </button>

            <div className="mb-8 border-l-4 border-green-500 pl-4 bg-white p-6 rounded-r-2xl shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Research Cell</p>
                <h1 className="text-3xl font-extrabold text-gray-900">{selectedCell.researchCell.title}</h1>
            </div>

            <div className="space-y-6">
            {selectedCell.proposals.map((proposal: any) => (
                <div key={proposal._id} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transition-all hover:shadow-2xl">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{proposal.title}</h2>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Pending</span>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 mb-6 font-medium text-gray-700 italic border-l-4 border-gray-300">
                        "{proposal.abstract}"
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <div className="flex items-center text-sm font-extrabold text-gray-400 uppercase tracking-widest mb-3">
                                <Users size={16} className="mr-2" /> Group Members
                            </div>
                            <div className="space-y-2">
                            {proposal.members.map((member: any) => (
                                <div key={member._id} className="bg-white border border-gray-100 p-3 rounded-xl shadow-sm flex justify-between items-center text-sm">
                                    <span className="font-bold text-gray-800">{member.name}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500 font-medium">{member.studentId}</span>
                                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold">CGPA: {member.currentCGPA}</span>
                                    </div>
                                </div>
                            ))}
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center text-sm font-extrabold text-gray-400 uppercase tracking-widest mb-3">
                                <Info size={16} className="mr-2" /> Submission Details
                            </div>
                            <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-medium">Lead Student:</span>
                                    <span className="font-bold text-gray-800">{proposal.createdBy.name}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-medium">Student ID:</span>
                                    <span className="font-bold text-gray-800">{proposal.createdBy.studentId}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                        <button
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-100 flex items-center justify-center disabled:bg-gray-400"
                            onClick={() => handleForward(proposal._id)}
                            disabled={isForwarding || isRejecting}
                        >
                            <Send size={18} className="mr-2" /> Forward to Supervisor
                        </button>
                        <button
                            className="flex-1 bg-white hover:bg-red-50 text-red-600 border-2 border-red-500 font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center disabled:bg-gray-100"
                            onClick={() => handleReject(proposal._id)}
                            disabled={isForwarding || isRejecting}
                        >
                            <XCircle size={18} className="mr-2" /> Reject Proposal
                        </button>
                    </div>
                </div>
            ))}
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-10 flex items-center">
            <Layers className="mr-3 text-green-600" size={32} />
            Pending Proposals by Research Cell
        </h1>
        
        {proposalsByCell && proposalsByCell.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {proposalsByCell.map((cell: any) => (
                <div
                    key={cell.researchCell._id}
                    className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 cursor-pointer overflow-hidden relative group transition-all hover:shadow-2xl hover:-translate-y-1"
                    onClick={() => handleCellClick(cell)}
                >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-12 -mt-12 transition-all group-hover:bg-green-500/10"></div>
                    
                    <h2 className="text-xl font-extrabold text-gray-900 mb-4 group-hover:text-green-700 transition-colors uppercase tracking-tight">{cell.researchCell.title}</h2>
                    
                    <div className="flex items-center justify-between mt-auto">
                        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center">
                            {cell.count} <span className="ml-1 font-medium">Pending</span>
                        </div>
                        <div className="text-green-600 group-hover:translate-x-2 transition-transform">
                            <ChevronRight size={24} />
                        </div>
                    </div>
                </div>
            ))}
            </div>
        ) : (
            <div className="p-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 text-lg font-medium italic">No pending proposals at this time.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default CommitteePendingProposalsPage;
