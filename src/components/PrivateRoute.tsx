'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSkeleton from './DashboardSkeleton';

interface PrivateRouteProps {
  children: React.ReactNode;
  role?: 'committee' | 'supervisor' | 'student' | 'admin';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const { loading, isMounted } = useAuth();
  const router = useRouter();

  // Redirect handling in useEffect
  useEffect(() => {
    // Only act on redirection after client-side hydration check is fully complete
    if (isMounted && !loading) {
      if (!user) {
        toast.error("Session expired or unauthorized access. Please log in again.");
        router.push('/login');
        return;
      }

      if (role && user.role !== role) {
        toast.error("Unauthorized access. Please log in with appropriate credentials.");
        router.push('/login');
        return;
      }
    }
  }, [user, role, router, loading, isMounted]);

  // IMPORTANT: SSR / Hydration Shield
  // Server MUST render the same thing as the first Client render.
  // We return null on server and initial client pass.
  if (!isMounted) {
    return null;
  }

  // Show skeleton while verifying session on the client
  if (loading) {
    return <DashboardSkeleton />;
  }

  // Final check to prevent content flash
  if (!user || (role && user.role !== role)) {
    return null;
  }

  return <>{children}</>;
};

export default PrivateRoute;
