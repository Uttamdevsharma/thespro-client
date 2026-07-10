import React from 'react';
import { format } from 'date-fns';
import { X, Calendar, User, FileText, Building2 } from 'lucide-react';

interface NoticeDetailModalProps {
  showModal: boolean;
  onClose: () => void;
  notice: any;
}

const NoticeDetailModal: React.FC<NoticeDetailModalProps> = ({ showModal, onClose, notice }) => {
  if (!showModal || !notice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/60 dark:border-slate-800/60 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 mt-1">
              <FileText size={20} />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight line-clamp-2">
                {notice.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 pt-4 space-y-6">
          {/* Meta info */}
          <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>{format(new Date(notice.createdAt), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User size={14} />
              <span>{notice.sender?.name || 'Committee'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building2 size={14} />
              <span>Committee Announcement</span>
            </div>
          </div>

          {/* Content */}
          <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
            {notice.description}
          </div>

          {/* Attachment */}
          {notice.file && (
            <div className="bg-slate-50 dark:bg-slate-950/50 rounded-xl p-4 border border-slate-200/60 dark:border-slate-800/60">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Attachment
              </p>
              <a
                href={`${process.env.NEXT_PUBLIC_BASE_URL || ''}${notice.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
              >
                <FileText size={16} />
                Download Attachment
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 dark:bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-indigo-700 transition-colors active:scale-[0.98]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetailModal;
