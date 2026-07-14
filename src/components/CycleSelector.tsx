'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useCycle } from '@/contexts/CycleContext';
import { Check, ChevronDown, Layers } from 'lucide-react';

const ALLOWED_ROLES = ['admin', 'committee', 'supervisor'];

const CycleSelector = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const { cycleId, selectedCycle, setSelectedCycle, allCycles, isCyclesLoading } = useCycle();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user || !ALLOWED_ROLES.includes(user.role)) return null;

  const handleSelect = (cycle: any) => {
    setSelectedCycle(cycle);
    setOpen(false);
  };

  const activeStatuses = ['Registration Open', 'Registration Closed', 'Running'];
  const activeCycles = allCycles?.filter((c: any) => activeStatuses.includes(c.status) && !c.archived) || [];
  const archivedCycles = allCycles?.filter((c: any) => c.archived || c.status === 'Completed') || [];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors min-w-[180px]"
      >
        <Layers size={14} className="text-slate-400 shrink-0" />
        <span className="truncate flex-1 text-left">
          {isCyclesLoading ? 'Loading...' : selectedCycle?.name || 'Select Cohort'}
        </span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1.5 z-50 max-h-80 overflow-y-auto">
          {isCyclesLoading ? (
            <div className="px-4 py-3 text-sm text-slate-400">Loading cohorts...</div>
          ) : (
            <>
              {activeCycles.length > 0 && (
                <div>
                  <div className="px-4 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Active Cohorts
                  </div>
                  {activeCycles.map((cycle: any) => (
                    <button
                      key={cycle._id}
                      onClick={() => handleSelect(cycle)}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="w-4 shrink-0">
                        {cycleId === cycle._id && <Check size={14} className="text-indigo-600 dark:text-indigo-400" />}
                      </div>
                      <span className={`flex-1 truncate ${cycleId === cycle._id ? 'font-semibold text-indigo-600 dark:text-indigo-400' : ''}`}>
                        {cycle.name}
                      </span>
                      <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {cycle.status}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {archivedCycles.length > 0 && (
                <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                  <div className="px-4 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Archived / Completed
                  </div>
                  {archivedCycles.map((cycle: any) => (
                    <button
                      key={cycle._id}
                      onClick={() => handleSelect(cycle)}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-left text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="w-4 shrink-0">
                        {cycleId === cycle._id && <Check size={14} className="text-indigo-600 dark:text-indigo-400" />}
                      </div>
                      <span className={`flex-1 truncate ${cycleId === cycle._id ? 'font-semibold text-indigo-600 dark:text-indigo-400' : ''}`}>
                        {cycle.name}
                      </span>
                      <span className="text-[10px] text-slate-400">{cycle.status}</span>
                    </button>
                  ))}
                </div>
              )}

              {allCycles?.length === 0 && (
                <div className="px-4 py-3 text-sm text-slate-400">No cohorts found</div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CycleSelector;
