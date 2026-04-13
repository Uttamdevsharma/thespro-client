'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';
import { Calendar, Save, AlertCircle, Clock } from 'lucide-react';
import { useGetSubmissionDatesQuery, useSetSubmissionDatesMutation } from '@/store/features/apiSlice';

const CommitteeSetSubmissionDatesPage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: currentDates, isLoading: loading, refetch } = useGetSubmissionDatesQuery(undefined, {
    skip: !user
  });
  const [setSubmissionDates, { isLoading: isSetting }] = useSetSubmissionDatesMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.token) return toast.error('User not logged in.');
    if (!startDate || !endDate) return toast.error('Please select both start and end dates.');

    try {
      await setSubmissionDates({ startDate, endDate }).unwrap();
      toast.success('Submission dates set successfully!');
      refetch();
      setStartDate('');
      setEndDate('');
    } catch (error: any) {
      toast.error(`Failed to set submission dates: ${error.data?.message || error.message}`);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 mb-8 flex items-center">
            <Calendar className="mr-3 text-green-600" size={32} />
            Proposal Submission Dates
        </h1>

        {currentDates && (
          <div className="bg-white dark:bg-gray-900 border-l-8 border-green-500 rounded-2xl shadow-xl p-8 mb-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Clock size={120} />
            </div>
            <div className="flex items-start gap-4">
                <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                    <AlertCircle size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-1">Current Active Submission Period</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Students can submit proposals during this time frame.</p>
                    
                    <div className="flex flex-col sm:flex-row gap-8">
                        <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Start Date</span>
                            <span className="text-lg font-extrabold text-gray-800 dark:text-gray-100">{new Date(currentDates.startDate).toLocaleDateString(undefined, { dateStyle: 'full' })}</span>
                        </div>
                        <div className="hidden sm:block w-px bg-gray-100"></div>
                        <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">End Date</span>
                            <span className="text-lg font-extrabold text-gray-800 dark:text-gray-100">{new Date(currentDates.endDate).toLocaleDateString(undefined, { dateStyle: 'full' })}</span>
                        </div>
                    </div>
                    
                    <div className="mt-8 pt-4 border-t border-gray-50 dark:border-gray-800/50 text-xs font-medium text-orange-600 flex items-center">
                        <Info className="mr-1" size={12} /> Setting new dates will automatically deactivate this period.
                    </div>
                </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-8 flex items-center">
                <Save className="mr-2 text-green-500" size={20} />
                Configure New Submission Window
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 ml-1">
                            Start Date
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-700 dark:text-gray-200 font-bold"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 ml-1">
                            End Date
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-700 dark:text-gray-200 font-bold"
                            required
                        />
                    </div>
                </div>
                
                <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-extrabold py-4 px-8 rounded-2xl shadow-lg shadow-green-200 transition-all transform hover:scale-[1.01] active:scale-100 flex justify-center items-center"
                >
                    <Save size={20} className="mr-2" /> Activate Submission Dates
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

const Info = ({ className, size }: { className?: string, size?: number }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
);

export default CommitteeSetSubmissionDatesPage;
