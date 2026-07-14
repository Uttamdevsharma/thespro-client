'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useCycle } from '@/contexts/CycleContext';
import { Check, ChevronDown, Layers } from 'lucide-react';

const ALLOWED_ROLES = ['admin', 'committee', 'supervisor'];

const statusConfig: Record<string, { label: string; className: string }> = {
  'Running': {
    label: 'Running',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800',
  },
  'Completed': {
    label: 'Completed',
    className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-slate-700',
  },
  'Registration Open': {
    label: 'Open',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-800',
  },
  'Registration Closed': {
    label: 'Closed',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800',
  },
  'Archived': {
    label: 'Archived',
    className: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500 ring-1 ring-slate-200 dark:ring-slate-700',
  },
};

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
  const previousCycles = allCycles?.filter((c: any) => c.archived || c.status === 'Completed') || [];

  const sortedActive = [...activeCycles].sort((a, b) => {
    if (a._id === cycleId) return -1;
    if (b._id === cycleId) return 1;
    return 0;
  });

  const sortedPrevious = [...previousCycles].sort((a, b) => {
    if (a._id === cycleId) return -1;
    if (b._id === cycleId) return 1;
    return 0;
  });

  return (
    <div className="relative select-none" ref={dropdownRef}>
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-0.5">
          Active Semester
        </span>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 transition-colors min-w-[200px]"
        >
          <Layers size={14} className="text-slate-400 shrink-0" />
          <span className="truncate flex-1 text-left">
            {isCyclesLoading ? 'Loading...' : selectedCycle?.name || 'Select Cohort'}
          </span>
          <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 rounded-xl shadow-lg shadow-black/5 dark:shadow-black/20 border border-slate-200 dark:border-slate-700 py-2 z-50 max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
          {isCyclesLoading ? (
            <div className="px-4 py-3 text-sm text-slate-400">Loading cohorts...</div>
          ) : (
            <>
              {sortedActive.length > 0 && (
                <div>
                  <div className="px-4 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Active Semesters
                  </div>
                  {sortedActive.map((cycle: any) => {
                    const isSelected = cycleId === cycle._id;
                    const badge = statusConfig[cycle.status] || {
                      label: cycle.status,
                      className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-slate-700',
                    };
                    return (
                      <button
                        key={cycle._id}
                        onClick={() => handleSelect(cycle)}
                        className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left transition-colors ${
                          isSelected
                            ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/60 dark:bg-indigo-950/30'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="w-4 shrink-0 flex items-center justify-center">
                          {isSelected && <Check size={14} className="text-indigo-600 dark:text-indigo-400" />}
                        </div>
                        <span className={`flex-1 truncate ${isSelected ? 'font-semibold' : ''}`}>
                          {cycle.name}
                        </span>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${badge.className}`}>
                          {badge.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {sortedPrevious.length > 0 && (
                <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                  <div className="px-4 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Previous Semesters
                  </div>
                  {sortedPrevious.map((cycle: any) => {
                    const isSelected = cycleId === cycle._id;
                    const badge = statusConfig[cycle.status] || {
                      label: cycle.status,
                      className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-slate-700',
                    };
                    return (
                      <button
                        key={cycle._id}
                        onClick={() => handleSelect(cycle)}
                        className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left transition-colors ${
                          isSelected
                            ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/60 dark:bg-indigo-950/30'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="w-4 shrink-0 flex items-center justify-center">
                          {isSelected && <Check size={14} className="text-indigo-600 dark:text-indigo-400" />}
                        </div>
                        <span className={`flex-1 truncate ${isSelected ? 'font-semibold' : ''}`}>
                          {cycle.name}
                        </span>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${badge.className}`}>
                          {badge.label}
                        </span>
                      </button>
                    );
                  })}
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
