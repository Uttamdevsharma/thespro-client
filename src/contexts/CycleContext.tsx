'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface CycleContextType {
  selectedCycle: any;
  cycleId: string | null;
  setSelectedCycle: (cycle: any) => void;
  clearSelectedCycle: () => void;
}

const CycleContext = createContext<CycleContextType | undefined>(undefined);

const STORAGE_KEY = 'selectedCycleId';

export const CycleProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCycle, setSelectedCycleState] = useState<any>(null);
  const [cycleId, setCycleId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSelectedCycleState(parsed);
        setCycleId(parsed?._id || null);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

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
    <CycleContext.Provider value={{ selectedCycle, cycleId, setSelectedCycle, clearSelectedCycle }}>
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
