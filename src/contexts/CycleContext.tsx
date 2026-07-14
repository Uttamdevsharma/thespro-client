'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
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

export const CycleProvider = ({ children }: { children: ReactNode }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const [selectedCycle, setSelectedCycleState] = useState<any>(null);
  const [cycleId, setCycleId] = useState<string | null>(null);

  const { data: activeCohort, isLoading: activeLoading } = useGetActiveCohortQuery(undefined, {
    skip: !user || !ALLOWED_ROLES.includes(user.role),
  });
  const { data: allCycles = [], isLoading: cyclesLoading } = useGetThesisCyclesQuery(undefined, {
    skip: !user || !ALLOWED_ROLES.includes(user.role),
  });

  const isCyclesLoading = activeLoading || cyclesLoading;

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSelectedCycleState(parsed);
        setCycleId(parsed?._id || null);
        return;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    if (activeCohort) {
      setSelectedCycleState(activeCohort);
      setCycleId(activeCohort._id);
    }
  }, [activeCohort]);

  const setSelectedCycle = useCallback((cycle: any) => {
    setSelectedCycleState(cycle);
    setCycleId(cycle?._id || null);
    if (cycle) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cycle));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const clearSelectedCycle = useCallback(() => {
    setSelectedCycleState(null);
    setCycleId(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <CycleContext.Provider value={{ selectedCycle, cycleId, setSelectedCycle, clearSelectedCycle, activeCohort, allCycles, isCyclesLoading }}>
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
