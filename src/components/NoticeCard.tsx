'use client';

import React from 'react';
import { format } from 'date-fns';
import { Calendar, ChevronRight, Bell } from 'lucide-react';

interface NoticeCardProps {
  notice: any;
  onReadMore?: (notice: any) => void;
}

const NoticeCard: React.FC<NoticeCardProps> = ({ notice, onReadMore }) => {
  const formattedDate = format(new Date(notice.createdAt), 'MMM dd, yyyy');

  const handleClick = () => {
    onReadMore?.(notice);
  };

  return (
    <div
      onClick={handleClick}
      className="group h-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 hover:shadow-2xl hover:shadow-blue-50 dark:hover:shadow-blue-900/20 transition-all duration-500 flex flex-col relative overflow-hidden cursor-pointer"
    >
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/30 dark:bg-blue-900/10 rounded-bl-[5rem] group-hover:scale-110 transition-transform duration-500" />

      <div className="flex items-center space-x-3 mb-6 relative">
        <div className="w-10 h-10 bg-blue-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
          <Bell size={20} />
        </div>
        <div className="flex items-center text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            <Calendar size={12} className="mr-1.5" />
            {formattedDate}
        </div>
      </div>

      <div className="flex-grow space-y-4 relative">
        <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 leading-tight line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {notice.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed line-clamp-3">
          {notice.description}
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between relative">
        <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black text-gray-900 dark:text-gray-300 uppercase tracking-widest">
                From Committee
            </span>
        </div>
        <span className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 font-black text-xs group-hover:translate-x-1 transition-transform pointer-events-none">
            <span>Read More</span>
            <ChevronRight size={14} />
        </span>
      </div>
    </div>
  );
};

export default NoticeCard;
