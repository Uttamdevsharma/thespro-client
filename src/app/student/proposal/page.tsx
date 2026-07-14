'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import toast from 'react-hot-toast';
import MultiSelectDropdown from '@/components/MultiSelectDropdown';
import { useCycle } from '@/contexts/CycleContext';
import {
  useCreateProposalMutation,
  useGetResearchCellsQuery,
  useGetStudentsQuery,
  useGetSupervisorsCapacityQuery,
  useGetMyCohortQuery,
  useGenerateProposalDescriptionMutation
} from '@/store/features/apiSlice';
import { Bot, Sparkles, Loader2 } from 'lucide-react';

const StudentProposalPage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [type, setType] = useState('Thesis');
  const [researchCell, setResearchCell] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [proposalSubmitted, setProposalSubmitted] = useState(false);

  // The student's own assigned cohort drives submission eligibility
  const { data: myCohort } = useGetMyCohortQuery(undefined, { skip: !user });

  const { data: cells = [] } = useGetResearchCellsQuery(undefined, { skip: !user });
  const { data: allStudents = [] } = useGetStudentsQuery(undefined, { skip: !user });
  const { data: supervisors = [] } = useGetSupervisorsCapacityQuery(researchCell, {
    skip: !researchCell || !user
  });

  const [createProposal, { isLoading: isSubmitting }] = useCreateProposalMutation();
  const [generateAI, { isLoading: isGenerating }] = useGenerateProposalDescriptionMutation();

  const noCohort = !myCohort;

  const submissionClosed = React.useMemo(() => {
    if (!myCohort) return true;
    if (!myCohort.proposalSubmissionOpen) return true;
    if (myCohort.proposalSubmissionDeadline && new Date() > new Date(myCohort.proposalSubmissionDeadline)) {
      return true;
    }
    return false;
  }, [myCohort]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error('User not logged in.');
    if (!researchCell || !supervisor) return toast.error('Select Research Cell & Supervisor.');
    if (submissionClosed) return toast.error('Proposal submission for this cohort has ended. Please wait for the next submission period.');

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
      cohortId: user?.cohort || myCohort?._id || undefined,
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
    <div className="max-w-4xl mx-auto p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-gray-100/80 dark:border-gray-800/80">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-gray-900 dark:text-gray-50 mb-2">Submit Proposal</h1>
        <p className="text-gray-400 font-bold">Fill in the details below to submit your research proposal.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-gray-700 dark:text-gray-200 text-xs font-black uppercase tracking-widest mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter proposal title"
            className="w-full px-5 py-4 bg-gray-50/80 dark:bg-gray-950/80 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-gray-900 dark:text-gray-50 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            required
          />
        </div>

        {/* Abstract */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-gray-700 dark:text-gray-200 text-xs font-black uppercase tracking-widest">Abstract</label>
            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={isGenerating || !title.trim()}
              className="flex items-center gap-1.5 text-xs font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-full transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
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
            className="w-full px-5 py-4 bg-gray-50/80 dark:bg-gray-950/80 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-gray-900 dark:text-gray-50 placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
            required
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-gray-700 dark:text-gray-200 text-xs font-black uppercase tracking-widest mb-2">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-5 py-4 bg-gray-50/80 dark:bg-gray-950/80 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-gray-900 dark:text-gray-50"
          >
            <option>Thesis</option>
            <option>Project</option>
          </select>
        </div>

        {/* Research Cell */}
        <div>
          <label className="block text-gray-700 dark:text-gray-200 text-xs font-black uppercase tracking-widest mb-2">Research Cell</label>
          <select
            value={researchCell}
            onChange={(e) => setResearchCell(e.target.value)}
            className="w-full px-5 py-4 bg-gray-50/80 dark:bg-gray-950/80 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-gray-900 dark:text-gray-50"
            required
          >
            <option value="">Select a cell</option>
            {cells.map((cell: any) => (
              <option key={cell._id} value={cell._id}>{cell.title}</option>
            ))}
          </select>
        </div>

        {/* Supervisor */}
        <div>
          <label className="block text-gray-700 dark:text-gray-200 text-xs font-black uppercase tracking-widest mb-2">Supervisor</label>
          <select
            value={supervisor}
            onChange={(e) => setSupervisor(e.target.value)}
            className="w-full px-5 py-4 bg-gray-50/80 dark:bg-gray-950/80 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-gray-900 dark:text-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!researchCell || submissionClosed}
            required
          >
            <option value="">Select a supervisor</option>
            {supervisors.map((s: any) => (
              <option key={s._id} value={s._id} disabled={s.remainingCapacity <= 0}>
                {s.name} ({s.remainingCapacity} groups remaining)
              </option>
            ))}
          </select>
          {supervisor && supervisors.find((s: any) => s._id === supervisor)?.remainingCapacity <= 0 && (
            <p className="text-red-500 text-sm mt-1 font-bold">Supervisor's seat capacity is full. Please choose another supervisor.</p>
          )}
          {submissionClosed && (
            <p className="text-red-500 text-sm mt-1 font-bold">Proposal submission for this cohort has ended.</p>
          )}
        </div>

        {/* Cohort — Auto-assigned */}
        <div>
          <label className="block text-gray-700 dark:text-gray-200 text-xs font-black uppercase tracking-widest mb-2">Cohort</label>
          {noCohort ? (
            <div className="w-full px-5 py-4 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-700 rounded-2xl text-amber-700 dark:text-amber-300 font-bold text-sm">
              You are not assigned to any cohort. Please complete your registration or contact the committee.
            </div>
          ) : submissionClosed ? (
            <div className="w-full px-5 py-4 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-700 rounded-2xl text-amber-700 dark:text-amber-300 font-bold text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              Proposal submission for {myCohort?.name} has ended. Please wait for the next submission period.
            </div>
          ) : (
            <div className="w-full px-5 py-4 bg-indigo-50/80 dark:bg-indigo-950/30 border-2 border-indigo-200 dark:border-indigo-800 rounded-2xl text-indigo-700 dark:text-indigo-300 font-bold text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              {myCohort?.name || 'Your Cohort'}
            </div>
          )}
        </div>

        {/* Members */}
        <div>
          <label className="block text-gray-700 dark:text-gray-200 text-xs font-black uppercase tracking-widest mb-2">Team Members</label>
          <MultiSelectDropdown
            allStudents={allStudents}
            members={members}
            setMembers={setMembers}
            currentUser={user}
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || submissionClosed || noCohort || (!!supervisor && supervisors.find((s: any) => s._id === supervisor)?.remainingCapacity <= 0)}
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-200/50 dark:shadow-indigo-900/30 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 hover:shadow-2xl hover:shadow-indigo-200/60 dark:hover:shadow-indigo-900/40 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              'Submit Proposal'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentProposalPage;
