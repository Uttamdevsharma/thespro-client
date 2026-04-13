'use client';

import React from 'react';
import ProfileIcon from '@/components/ProfileIcon';
import Sidebar from '@/components/Sidebar';
import PrivateRoute from '@/components/PrivateRoute';

import AuthNavbar from '@/components/AuthNavbar';
import { UIProvider } from '@/contexts/UIContext';

export default function CommitteeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivateRoute role="committee">
      <UIProvider>
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
          <AuthNavbar />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar role="committee" />
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
              <div className="max-w-7xl mx-auto">{children}</div>
            </main>
          </div>
        </div>
      </UIProvider>
    </PrivateRoute>
  );
}
