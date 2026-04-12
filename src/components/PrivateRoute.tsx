'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { toast } from 'react-hot-toast';

interface PrivateRouteProps {
  children: React.ReactNode;
  role?: 'committee' | 'supervisor' | 'student';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const router = useRouter();

  useEffect(() => {
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
  }, [user, role, router]);

  if (!user || (role && user.role !== role)) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
};

export default PrivateRoute;
