'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useGetRoomsQuery, useGetScheduleSlotsQuery, useCreateDefenseBoardMutation } from '@/store/features/apiSlice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { useCycle } from '@/contexts/CycleContext';
import { setBoardDraft, clearBoardDraft } from '@/store/features/boardDraftSlice';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeft, Save, Users, Layers, MapPin, Clock } from 'lucide-react';

const CommitteeCreateDefenseBoardPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { cycleId } = useCycle();
  const { data: rooms } = useGetRoomsQuery();
  const { data: scheduleSlots } = useGetScheduleSlotsQuery();
  const [createDefenseBoard, { isLoading: isCreating }] = useCreateDefenseBoardMutation();
  const boardDraft = useSelector((state: RootState) => state.boardDraft);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    dispatch(setBoardDraft({ [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedSchedule = scheduleSlots?.find((slot: any) => slot._id === boardDraft.schedule);
      if (!selectedSchedule) {
        toast.error('Please select a valid schedule.');
        return;
      }
      const dataToSubmit = { ...boardDraft, date: selectedSchedule.date, thesisCycleId: cycleId || undefined };
      await createDefenseBoard(dataToSubmit).unwrap();
      toast.success('Defense board created successfully.');
      dispatch(clearBoardDraft());
      router.push('/committee/defense-schedule');
    } catch (err: any) {
      toast.error(err?.data?.message || err.error || 'Failed to create defense board');
    }
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-5 mb-10">
            <button
                onClick={() => {
                    dispatch(clearBoardDraft());
                    router.push('/committee/defense-schedule');
                }}
                className="p-3 hover:bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all cursor-pointer bg-gray-50 dark:bg-gray-950 group"
            >
                <ArrowLeft size={24} className="text-gray-600 dark:text-gray-300 group-hover:text-green-600" />
            </button>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight flex items-center">
                <Layers className="mr-3 text-green-600" size={32} />
                Create New Defense Board
            </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Board Number */}
            <div>
                <label className="block text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 ml-1">Board Designation</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">#</span>
                    <input
                        type="text"
                        name="boardNumber"
                        placeholder="e.g. 01, 02-B"
                        value={boardDraft.boardNumber}
                        onChange={handleChange}
                        className="w-full pl-8 pr-4 py-4 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-green-400 focus:bg-white dark:focus:bg-gray-900 dark:bg-gray-900 outline-none transition-all font-extrabold text-gray-800 dark:text-gray-100"
                        required
                    />
                </div>
            </div>

            {/* Defense Type */}
            <div>
                <label className="block text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 ml-1">Examination Phase</label>
                <select
                    name="defenseType"
                    value={boardDraft.defenseType}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-green-400 focus:bg-white dark:focus:bg-gray-900 dark:bg-gray-900 outline-none transition-all font-bold text-gray-700 dark:text-gray-200"
                >
                    <option value="Pre-Defense">Pre-Defense</option>
                    <option value="Final Defense">Final Defense</option>
                </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Room */}
            <div>
              <label className="block text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 ml-1 flex items-center">
                  <MapPin size={14} className="mr-1" /> Campus Venue
              </label>
              <select
                id="room-select"
                name="room"
                value={boardDraft.room}
                onChange={handleChange}
                className="w-full px-4 py-4 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-green-400 outline-none transition-all font-bold text-gray-900 dark:text-gray-50 shadow-sm"
                required
              >
                <option value="" className="text-gray-400 text-sm">-- Choose Venue --</option>
                {rooms?.map((room: any) => (
                  <option key={room._id} value={room._id} className="text-gray-900 dark:text-gray-50 font-medium">
                    {room.name} (Cap: {room.capacity})
                  </option>
                ))}
              </select>
            </div>

            {/* Schedule */}
            <div>
              <label className="block text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 ml-1 flex items-center">
                  <Clock size={14} className="mr-1" /> Time Assignment
              </label>
              <select
                id="schedule-select"
                name="schedule"
                value={boardDraft.schedule}
                onChange={handleChange}
                className="w-full px-4 py-4 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-green-400 outline-none transition-all font-bold text-gray-900 dark:text-gray-50 shadow-sm"
                required
              >
                <option value="" className="text-gray-400 text-sm">-- Choose Slot --</option>
                {scheduleSlots?.map((slot: any) => (
                  <option key={slot._id} value={slot._id} className="text-gray-900 dark:text-gray-50 font-medium">
                    {new Date(slot.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} | {slot.startTime} - {slot.endTime}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-y border-gray-50 dark:border-gray-800/50">
            {/* Select Groups */}
            <div className="group">
                <button
                    type="button"
                    onClick={() => router.push('/committee/defense-schedule/create/select-groups')}
                    className="w-full flex items-center justify-between p-6 bg-blue-50 border-2 border-blue-200 rounded-2xl hover:bg-blue-600 hover:text-white transition-all transform active:scale-95 group shadow-md"
                >
                    <div className="flex items-center text-left">
                        <Users size={32} className="mr-4 text-blue-600 group-hover:text-white transition-colors" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-blue-100 mb-1 opacity-70">Step 1: Assign Candidates</p>
                            <p className="text-lg font-black text-blue-900 group-hover:text-white transition-colors">Attach Student Groups</p>
                            <span className="text-xs font-bold text-blue-500 group-hover:text-blue-200">{boardDraft.groups.length} Groups Selected</span>
                        </div>
                    </div>
                    <ChevronRight size={24} className="text-blue-400 group-hover:text-white" />
                </button>
            </div>

            {/* Select Members */}
            <div className="group">
                <button
                    type="button"
                    onClick={() => router.push('/committee/defense-schedule/create/select-members')}
                    className="w-full flex items-center justify-between p-6 bg-purple-50 border-2 border-purple-200 rounded-2xl hover:bg-purple-600 hover:text-white transition-all transform active:scale-95 group shadow-md"
                >
                    <div className="flex items-center text-left">
                        <Users size={32} className="mr-4 text-purple-600 group-hover:text-white transition-colors" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-purple-100 mb-1 opacity-70">Step 2: Assign Evaluators</p>
                            <p className="text-lg font-black text-purple-900 group-hover:text-white transition-colors">Board Members</p>
                            <span className="text-xs font-bold text-purple-500 group-hover:text-purple-200">{boardDraft.boardMembers.length} Members Selected</span>
                        </div>
                    </div>
                    <ChevronRight size={24} className="text-purple-400 group-hover:text-white" />
                </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={isCreating}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-5 px-10 rounded-2xl shadow-xl shadow-green-200 transition-all transform hover:scale-[1.02] active:scale-100 flex items-center justify-center disabled:bg-gray-400"
            >
              <Save size={24} className="mr-3" />
              {isCreating ? 'Finalizing Configuration...' : 'Confirm and Deploy Board'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ChevronRight = ({ size, className }: { size?: number, className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="m9 18 6-6-6-6"/>
    </svg>
);

export default CommitteeCreateDefenseBoardPage;
