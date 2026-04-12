'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { login, logout } from '@/store/features/userSlice';
import { useGetProfileQuery } from '@/store/features/apiSlice';

interface AuthContextType {
  currentUser: any;
  loading: boolean;
  isMounted: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [tokenFound, setTokenFound] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsMounted(true);
    // Safe client-side check for token
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      setTokenFound(true);
      try {
        const userInfo = JSON.parse(userInfoString);
        // Initial Redux hydration from localStorage to minimize flickers
        dispatch(login(userInfo));
        setCurrentUser(userInfo);
      } catch (err) {
        console.error('Initial hydration failed:', err);
      }
    }
  }, [dispatch]);

  // Call backend to get latest profile ONLY if token was found and we are on client
  const { data: profile, isLoading, isError, isSuccess } = useGetProfileQuery(undefined, {
    skip: !tokenFound || !isMounted,
  });

  useEffect(() => {
    if (isSuccess && profile) {
      const storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const updatedUserInfo = { ...storedUserInfo, ...profile };
      
      // Update Redux and local state with fresh data
      dispatch(login(updatedUserInfo));
      setCurrentUser(updatedUserInfo);
      
      // Sync localStorage
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
    }

    if (isError) {
      console.warn('Backend session restoration failed. Clearing session.');
      dispatch(logout());
      setCurrentUser(null);
    }
  }, [isSuccess, profile, isError, dispatch]);

  const value = {
    currentUser,
    // We are loading if:
    // 1. We haven't mounted yet (SSR phase)
    // 2. We found a token and are currently re-fetching the profile
    loading: !isMounted || (tokenFound && isLoading),
    isMounted,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
