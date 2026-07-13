'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useGetThesisCyclesQuery } from '@/store/features/apiSlice';
import { useCycle } from '@/contexts/CycleContext';
import { ChevronDown } from 'lucide-react';

const ALLOWED_ROLES = ['admin', 'committee', 'supervisor'];

const CycleSelector = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const { data: cycles, isLoading } = useGetThesisCyclesQuery(undefined, {
    skip: !user || !ALLOWED_ROLES.includes(user.role),
  });
  const { cycleId, setSelectedCycle, clearSelectedCycle } = useCycle();

  if (!user || !ALLOWED_ROLES.includes(user.role)) return null;

  const activeCycles = cycles?.filter((c: any) => !c.archived) || [];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (!id) {
      clearSelectedCycle();
      return;
    }
    const cycle = cycles?.find((c: any) => c._id === id);
    setSelectedCycle(cycle || null);
  };

  return (
    <div className="relative flex items-center">
      <select
        value={cycleId || ''}
        onChange={handleChange}
        className="appearance-none bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 pr-7 text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors min-w-[140px]"
      >
        <option value="">All Cycles</option>
        {isLoading ? (
          <option disabled>Loading...</option>
        ) : (
          activeCycles.map((cycle: any) => (
            <option key={cycle._id} value={cycle._id}>
              {cycle.name}
            </option>
          ))
        )}
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute right-2 text-slate-400" />
    </div>
  );
};

export default CycleSelector;
