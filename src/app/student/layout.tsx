'use client';

import React from 'react';
import NotificationBell from '@/components/NotificationBell';
import ProfileIcon from '@/components/ProfileIcon';
import Sidebar from '@/components/Sidebar';
import PrivateRoute from '@/components/PrivateRoute';

import AuthNavbar from '@/components/AuthNavbar';
import { UIProvider } from '@/contexts/UIContext';
import { useSelector } from 'react-redux';
import { selectUser } from '@/store/features/userSlice';
import { useRouter } from 'next/navigation';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useSelector(selectUser);

  // Profile Completion Guard
  React.useEffect(() => {
    if (user && user.role === 'student') {
        if (!user.department || !user.studentId || !user.currentCGPA) {
            router.push('/complete-profile');
        }
    }
  }, [user, router]);

  return (
    <PrivateRoute role="student">
      <UIProvider>
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
          <AuthNavbar />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar role="student" />
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
              <div className="max-w-7xl mx-auto">{children}</div>
            </main>
          </div>
        </div>
      </UIProvider>
    </PrivateRoute>
  );
}
