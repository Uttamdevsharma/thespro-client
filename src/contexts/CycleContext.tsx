'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback, useMemo } from 'react';
import { useGetActiveCohortQuery, useGetThesisCyclesQuery } from '@/store/features/apiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface CycleContextType {
  selectedCycle: any;
  cycleId: string | null;
  setSelectedCycle: (cycle: any) => void;
  clearSelectedCycle: () => void;
  activeCohort: any;
  allCycles: any[];
  isCyclesLoading: boolean;
}

const CycleContext = createContext<CycleContextType | undefined>(undefined);

const STORAGE_KEY = 'selectedCycleId';
const ALLOWED_ROLES = ['admin', 'committee', 'supervisor'];

const readStored = (): any => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?._id ? parsed : null;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const CycleProvider = ({ children }: { children: ReactNode }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const [selectedCycle, setSelectedCycleState] = useState<any>(() => readStored());
  const persistedDefault = useRef(!!selectedCycle);

  const { data: activeCohort, isLoading: activeLoading } = useGetActiveCohortQuery(undefined, {
    skip: !user || !ALLOWED_ROLES.includes(user.role),
  });
  const { data: allCycles = [], isLoading: cyclesLoading } = useGetThesisCyclesQuery(undefined, {
    skip: !user || !ALLOWED_ROLES.includes(user.role),
  });

  const isCyclesLoading = activeLoading || cyclesLoading;

  // Effective cohort: user-selected > stored > activeCohort > latest
  const effectiveCycle = useMemo(() => {
    if (selectedCycle) return selectedCycle;
    return activeCohort || allCycles[0] || null;
  }, [selectedCycle, activeCohort, allCycles]);

  // Persist default cohort to localStorage once data arrives (external system sync)
  useEffect(() => {
    if (persistedDefault.current) return;
    if (!effectiveCycle) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(effectiveCycle));
    } catch { /* noop */ }
    persistedDefault.current = true;
  }, [effectiveCycle]);

  const setSelectedCycle = useCallback((cycle: any) => {
    setSelectedCycleState(cycle);
    persistedDefault.current = true;
    try {
      if (cycle) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cycle));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch { /* noop */ }
  }, []);

  const clearSelectedCycle = useCallback(() => {
    setSelectedCycleState(null);
    persistedDefault.current = false;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch { /* noop */ }
  }, []);

  const value = useMemo(() => ({
    selectedCycle: effectiveCycle,
    cycleId: effectiveCycle?._id || null,
    setSelectedCycle,
    clearSelectedCycle,
    activeCohort,
    allCycles,
    isCyclesLoading,
  }), [effectiveCycle, setSelectedCycle, clearSelectedCycle, activeCohort, allCycles, isCyclesLoading]);

  return (
    <CycleContext.Provider value={value}>
      {children}
    </CycleContext.Provider>
  );
};

export const useCycle = () => {
  const context = useContext(CycleContext);
  if (context === undefined) {
    throw new Error('useCycle must be used within a CycleProvider');
  }
  return context;
};
