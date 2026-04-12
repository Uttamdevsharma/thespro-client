'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import AuthNavbar from '@/components/AuthNavbar';
import PrivateRoute from '@/components/PrivateRoute';

import { UIProvider } from '@/contexts/UIContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PrivateRoute role="admin">
      <UIProvider>
        <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
          <AuthNavbar />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar role="admin" />
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </UIProvider>
    </PrivateRoute>
  );
}
