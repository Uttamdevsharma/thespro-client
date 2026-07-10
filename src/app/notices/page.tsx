'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGetPublicNoticesQuery } from '@/store/features/apiSlice';
import { format } from 'date-fns';
import { Bell, Calendar, User, Building2, ChevronRight, ArrowRight, FileText, Info } from 'lucide-react';
import Loader from '@/components/Loader';
import NoticeDetailModal from '@/components/NoticeDetailModal';

const NoticesPage = () => {
  const { data: notices, isLoading } = useGetPublicNoticesQuery();
  const [selectedNotice, setSelectedNotice] = useState<any | null>(null);

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-28 pb-20 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/60 dark:border-indigo-900/40 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Bell size={14} />
            <span>Announcements</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white">
            All <span className="text-indigo-600 dark:text-indigo-400">Notices</span>
          </h1>
        </div>

        {/* Notices Grid */}
        {!notices || notices.length === 0 ? (
          <div className="py-20 bg-slate-50 dark:bg-slate-950 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center space-y-4">
            <Info className="text-slate-300" size={40} />
            <p className="text-slate-400 font-bold text-lg">No notices available at this time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notices.map((notice: any) => (
              <button
                key={notice._id}
                onClick={() => setSelectedNotice(notice)}
                className="w-full text-left group bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-6 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {notice.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {notice.description}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 dark:text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {format(new Date(notice.createdAt), 'MMM dd, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <User size={12} />
                          {notice.sender?.name || 'Committee'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building2 size={12} />
                          Committee
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0 mt-2 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Back link */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <ArrowRight size={16} className="rotate-180" />
            Back to Home
          </Link>
        </div>
      </div>

      <NoticeDetailModal
        showModal={!!selectedNotice}
        onClose={() => setSelectedNotice(null)}
        notice={selectedNotice}
      />
    </div>
  );
};

export default NoticesPage;
