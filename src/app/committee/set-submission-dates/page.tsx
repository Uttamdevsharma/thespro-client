'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import toast from 'react-hot-toast';
import PageSkeleton from '@/components/PageSkeleton';
import { Calendar, Save, AlertCircle, Clock } from 'lucide-react';
import { useCycle } from '@/contexts/CycleContext';
import {
  useGetThesisCycleByIdQuery,
  useSetProposalSubmissionMutation,
} from '@/store/features/apiSlice';

const CommitteeSetSubmissionDatesPage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const { cycleId } = useCycle();
  const [deadline, setDeadline] = useState('');
  const [open, setOpen] = useState(false);

  const { data: cohort, isLoading: loading, refetch } = useGetThesisCycleByIdQuery(cycleId || '', {
    skip: !user || !cycleId,
  });
  const [setProposalSubmission, { isLoading: isSetting }] = useSetProposalSubmissionMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.token) return toast.error('User not logged in.');
    if (!cycleId) return toast.error('Please select a cohort from the navbar first.');

    try {
      await setProposalSubmission({
        id: cycleId,
        open,
        proposalSubmissionDeadline: deadline || undefined,
      }).unwrap();
      toast.success('Proposal submission window updated!');
      refetch();
      setDeadline('');
    } catch (error: any) {
      toast.error(`Failed to update submission window: ${error.data?.message || error.message}`);
    }
  };

  if (!cycleId) {
    return (
      <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
        <div className="max-w-3xl mx-auto">
          <div className="bg-amber-50 dark:bg-amber-900/20 border-l-8 border-amber-500 rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-1">Select a Cohort</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Use the cohort selector in the top navbar to choose the cohort whose proposal submission you want to manage.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <PageSkeleton />;

  const currentDeadline = cohort?.proposalSubmissionDeadline
    ? new Date(cohort.proposalSubmissionDeadline).toLocaleDateString(undefined, { dateStyle: 'full' })
    : 'Not set';

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 mb-8 flex items-center">
          <Calendar className="mr-3 text-green-600" size={32} />
          Proposal Submission &mdash; {cohort?.name}
        </h1>

        <div className="bg-white dark:bg-gray-900 border-l-8 border-green-500 rounded-2xl shadow-xl p-8 mb-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Clock size={120} />
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-green-100 text-green-600 p-2 rounded-lg">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-1">Current Submission Window</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                Students in this cohort can submit proposals while submission is open and before the deadline.
              </p>
              <div className="flex flex-col sm:flex-row gap-8">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Status</span>
                  <span className={`text-lg font-extrabold ${cohort?.proposalSubmissionOpen ? 'text-green-600' : 'text-gray-400'}`}>
                    {cohort?.proposalSubmissionOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
                <div className="hidden sm:block w-px bg-gray-100"></div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Deadline</span>
                  <span className="text-lg font-extrabold text-gray-800 dark:text-gray-100">{currentDeadline}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-8 flex items-center">
            <Save className="mr-2 text-green-500" size={20} />
            Configure Submission Window
          </h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={open}
                onChange={(e) => setOpen(e.target.checked)}
                className="w-5 h-5"
              />
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                {open ? 'Proposal submission is OPEN' : 'Proposal submission is CLOSED'}
              </span>
            </label>

            <div>
              <label htmlFor="deadline" className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 ml-1">
                Submission Deadline (optional)
              </label>
              <input
                type="date"
                id="deadline"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-700 dark:text-gray-200 font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={isSetting}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-extrabold py-4 px-8 rounded-2xl shadow-lg shadow-green-200 transition-all transform hover:scale-[1.01] active:scale-100 flex justify-center items-center disabled:opacity-60"
            >
              <Save size={20} className="mr-2" /> Save Submission Window
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommitteeSetSubmissionDatesPage;
