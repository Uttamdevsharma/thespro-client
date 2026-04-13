'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import toast from 'react-hot-toast';
import MultiSelectDropdown from '@/components/MultiSelectDropdown';
import { 
  useCreateProposalMutation, 
  useGetResearchCellsQuery, 
  useGetStudentsQuery, 
  useGetSubmissionDatesQuery,
  useGetSupervisorsCapacityQuery,
  useGenerateProposalDescriptionMutation
} from '@/store/features/apiSlice';
import { Bot, Sparkles } from 'lucide-react';

const StudentProposalPage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [type, setType] = useState('Thesis');
  const [researchCell, setResearchCell] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [proposalSubmitted, setProposalSubmitted] = useState(false);

  const { data: cells = [] } = useGetResearchCellsQuery(undefined, { skip: !user });
  const { data: allStudents = [] } = useGetStudentsQuery(undefined, { skip: !user });
  const { data: deadlineData } = useGetSubmissionDatesQuery(undefined, { skip: !user });
  const { data: supervisors = [] } = useGetSupervisorsCapacityQuery(researchCell, { 
    skip: !researchCell || !user 
  });

  const [createProposal, { isLoading: isSubmitting }] = useCreateProposalMutation();
  const [generateAI, { isLoading: isGenerating }] = useGenerateProposalDescriptionMutation();

  const handleGenerateAI = async () => {
    if (!title.trim()) return toast.error('Please enter a title first.');
    
    try {
      const result = await generateAI({ title }).unwrap();
      setAbstract(result.description);
      toast.success('Description generated successfully!');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to generate description.');
    }
  };

  const submissionDeadlinePassed = React.useMemo(() => {
    if (!deadlineData) return false;
    return new Date() > new Date(deadlineData.endDate);
  }, [deadlineData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error('User not logged in.');
    if (!researchCell || !supervisor) return toast.error('Select Research Cell & Supervisor.');
    if (submissionDeadlinePassed) return toast.error('Proposal submission deadline has ended.');

    const selectedSupervisor = supervisors.find((s: any) => s._id === supervisor);
    if (selectedSupervisor && selectedSupervisor.remainingCapacity <= 0) {
      return toast.error('Supervisor\'s seat capacity is full. Please choose another supervisor.');
    }

    const proposalData = {
      title,
      abstract,
      type,
      researchCellId: researchCell,
      supervisorId: supervisor,
      members: members.map((m) => m._id),
    };

    try {
      await createProposal(proposalData).unwrap();
      toast.success('Proposal submitted successfully!');
      setTitle(''); setAbstract(''); setType('Thesis'); setResearchCell(''); setSupervisor(''); setMembers([]);
      setProposalSubmitted(prev => !prev);
    } catch (error: any) {
      toast.error(`Failed to submit proposal: ${error.data?.message || error.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100 text-center">Submit Proposal</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter proposal title"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 sm:text-sm text-gray-700 dark:text-gray-200"
            required
          />
        </div>

        {/* Abstract */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Abstract</label>
            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={isGenerating || !title.trim()}
              className="flex items-center space-x-1.5 text-xs font-black text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full transition-all disabled:opacity-50 active:scale-95"
            >
              {isGenerating ? (
                <>
                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Generate with AI</span>
                </>
              )}
            </button>
          </div>
          <textarea
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
            rows={5}
            placeholder="Enter a brief abstract"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 sm:text-sm text-gray-700 dark:text-gray-200"
            required
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 sm:text-sm text-gray-700 dark:text-gray-200"
          >
            <option>Thesis</option>
            <option>Project</option>
          </select>
        </div>

        {/* Research Cell */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Research Cell</label>
          <select
            value={researchCell}
            onChange={(e) => setResearchCell(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 sm:text-sm text-gray-700 dark:text-gray-200"
            required
          >
            <option value="">Select a cell</option>
            {cells.map((cell) => (
              <option key={cell._id} value={cell._id}>{cell.title}</option>
            ))}
          </select>
        </div>

        {/* Supervisor */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Supervisor</label>
          <select
            value={supervisor}
            onChange={(e) => setSupervisor(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 sm:text-sm text-gray-700 dark:text-gray-200 disabled:opacity-50"
            disabled={!researchCell || submissionDeadlinePassed}
            required
          >
            <option value="">Select a supervisor</option>
            {supervisors.map((s) => (
              <option key={s._id} value={s._id} disabled={s.remainingCapacity <= 0}>
                {s.name} ({s.remainingCapacity} groups remaining)
              </option>
            ))}
          </select>
          {supervisor && supervisors.find(s => s._id === supervisor)?.remainingCapacity <= 0 && (
            <p className="text-red-500 text-sm mt-1">Supervisor's seat capacity is full. Please choose another supervisor.</p>
          )}
          {submissionDeadlinePassed && (
            <p className="text-red-500 text-sm mt-1">Proposal submission deadline has ended.</p>
          )}
        </div>

        {/* Members */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Team Members</label>
          <MultiSelectDropdown
            allStudents={allStudents}
            members={members}
            setMembers={setMembers}
            currentUser={user}
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting || submissionDeadlinePassed || (!!supervisor && supervisors.find(s => s._id === supervisor)?.remainingCapacity <= 0)}
            className="w-full py-3 px-6 bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold rounded-lg shadow-md hover:from-green-500 hover:to-green-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentProposalPage;
