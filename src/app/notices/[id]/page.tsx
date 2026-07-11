'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useGetPublicNoticeByIdQuery } from '@/store/features/apiSlice';
import { format } from 'date-fns';
import { Calendar, User, Building2, FileText, ArrowLeft, Bell, ExternalLink } from 'lucide-react';
import DetailPageSkeleton from '@/components/DetailPageSkeleton';

const NoticeDetailPage = () => {
  const { id } = useParams();
  const { data: notice, isLoading, error } = useGetPublicNoticeByIdQuery(id as string);

  if (isLoading) return <DetailPageSkeleton />;

  if (error || !notice) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-28 pb-20 font-sans">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="py-20 text-slate-400 dark:text-slate-500">
            <Bell size={48} className="mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">Notice not found</h2>
            <p className="text-sm mb-8">This notice may have been removed or is no longer available.</p>
            <Link
              href="/notices"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <ArrowLeft size={16} />
              Browse All Notices
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-28 pb-20 font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/notices"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Notices
        </Link>

        {/* Notice Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-8 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <FileText size={24} />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {format(new Date(notice.createdAt), 'MMMM dd, yyyy')}
                </span>
                <span className="flex items-center gap-1.5">
                  <User size={14} />
                  {notice.sender?.name || 'Committee'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 size={14} />
                  Committee Announcement
                </span>
              </div>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
              {notice.title}
            </h1>
          </div>

          {/* Body */}
          <div className="p-8 pt-6">
            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {notice.description}
            </div>

            {/* Attachment */}
            {notice.file && (
              <div className="mt-8 bg-slate-50 dark:bg-slate-950/50 rounded-xl p-5 border border-slate-200/60 dark:border-slate-800/60">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  Attachment
                </p>
                <a
                  href={`${process.env.NEXT_PUBLIC_BASE_URL || ''}${notice.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                >
                  <ExternalLink size={16} />
                  Download Attachment
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetailPage;
