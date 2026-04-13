'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';

interface ResearchCellCardProps {
  cell: {
    _id: string;
    title: string;
    department: string;
  };
  departmentName?: string;
  selectedDeptId: string | null;
}

const ResearchCellCard: React.FC<ResearchCellCardProps> = ({ cell, departmentName, selectedDeptId }) => {
  return (
    <Link
      href={`/browse-supervisors?department=${selectedDeptId}&cell=${cell._id}`}
      className="group relative p-8 bg-white dark:bg-gray-900 border-2 border-gray-50 dark:border-gray-800 rounded-[2.5rem] hover:border-[#50C878] dark:hover:border-[#50C878] hover:shadow-[0_20px_50px_rgba(80,200,120,0.15)] transition-all duration-500 flex flex-col items-start overflow-hidden h-full"
    >
      {/* Decorative background gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#50C878]/5 to-transparent rounded-bl-[5rem] group-hover:scale-150 transition-transform duration-700" />
      
      {/* Icon Area */}
      <div className="relative mb-6">
        <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center group-hover:bg-[#50C878] group-hover:rotate-[10deg] transition-all duration-500 shadow-sm">
          <ShieldCheck className="text-gray-400 dark:text-gray-500 dark:text-gray-400 group-hover:text-white transition-colors" size={28} />
        </div>
        
        {/* Floating tag */}
        {departmentName && (
          <div className="absolute -top-2 -right-16 px-3 py-1 bg-[#1a2b3c] text-white text-[9px] font-black uppercase tracking-widest rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            {departmentName}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative space-y-3 flex-grow">
        <h4 className="text-xl font-black text-gray-900 dark:text-gray-100 leading-tight group-hover:text-[#50C878] transition-colors duration-300">
          {cell.title}
        </h4>
        <p className="text-sm text-gray-400 dark:text-gray-500 dark:text-gray-400 font-medium leading-relaxed group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-400 transition-colors">
          Explore research opportunities and connect with specialized supervisors in this field.
        </p>
      </div>

      {/* Footer / Interaction Hint */}
      <div className="relative mt-8 flex items-center justify-between w-full">
        <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black text-gray-900 dark:text-gray-300 uppercase tracking-[0.2em] group-hover:text-[#50C878] transition-colors">
                Browse Projects
            </span>
            <div className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full group-hover:bg-[#50C878]" />
        </div>
        
        <div className="w-10 h-10 rounded-full border border-gray-100 dark:border-gray-700 flex items-center justify-center group-hover:bg-[#50C878] group-hover:border-[#50C878] transition-all duration-300">
           <ArrowUpRight size={18} className="text-gray-400 dark:text-gray-500 dark:text-gray-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#50C878] group-hover:w-full transition-all duration-500" />
    </Link>
  );
};

export default ResearchCellCard;
