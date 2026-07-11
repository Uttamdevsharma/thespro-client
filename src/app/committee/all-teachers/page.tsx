'use client';

import React from 'react';
import Link from 'next/link';
import { useGetTeachersQuery } from '@/store/features/apiSlice';
import ListPageSkeleton from '@/components/ListPageSkeleton';
import { User, Mail, GraduationCap, ArrowRight, UserCog, FlaskConical, Filter } from 'lucide-react';

const CommitteeAllTeachersPage = () => {
  const { data: teachers, isLoading, isError, error } = useGetTeachersQuery();

  if (isLoading) return <ListPageSkeleton />;
  if (isError) return (
    <div className="p-10 text-center text-red-500 font-bold bg-red-50 rounded-2xl border border-red-100 max-w-6xl mx-auto mt-10">
        Error: {(error as any)?.message || 'Failed to fetch faculty directory'}
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-gray-50 tracking-tight flex items-center">
                    <GraduationCap className="mr-3 text-green-600" size={32} />
                    Faculty Directory
                </h1>
                <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">Global roster of academic supervisors</p>
            </div>
            
            <Link 
                href="/committee/add-teacher"
                className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl shadow-xl shadow-green-100 transition-all transform active:scale-95"
            >
                <UserCog className="mr-2" size={18} />
                Onboard New Faculty
            </Link>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-950/50 border-b border-gray-100 dark:border-gray-800">
                            <th className="py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest w-20">Identity</th>
                            <th className="py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Faculty Member</th>
                            <th className="py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Communication</th>
                            <th className="py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned Domains</th>
                            <th className="py-5 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Operations</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {teachers && teachers.length > 0 ? (
                            teachers.map((teacher: any, index: number) => (
                                <tr key={teacher._id} className="hover:bg-green-50/20 transition-all group">
                                    <td className="py-6 px-8">
                                        <div className="w-10 h-10 bg-gray-100 text-gray-400 flex items-center justify-center rounded-xl font-black text-xs border border-gray-200 dark:border-gray-700 group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 transition-all">
                                            {index + 1 < 10 ? `0${index + 1}` : index + 1}
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-50 p-2 rounded-lg text-blue-500">
                                                <User size={18} />
                                            </div>
                                            <span className="font-extrabold text-gray-900 dark:text-gray-50 tracking-tight uppercase group-hover:text-green-700 transition-colors">{teacher.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <div className="flex items-center text-sm font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-950 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-800 group-hover:bg-white dark:bg-gray-900 transition-all">
                                            <Mail size={14} className="mr-2 text-blue-400" />
                                            {teacher.email}
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <div className="flex flex-wrap gap-2">
                                            {teacher.researchCells && teacher.researchCells.length > 0 ? (
                                                teacher.researchCells.map((cell: any) => (
                                                    <span key={cell._id} className="inline-flex items-center bg-purple-50 text-purple-700 text-[9px] font-black px-2 py-0.5 rounded border border-purple-100 uppercase tracking-tighter">
                                                        <FlaskConical size={10} className="mr-1" />
                                                        {cell.title}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-[10px] font-black text-red-400 uppercase tracking-tighter italic opacity-60">No Domains Mapped</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-6 px-8 text-right">
                                        <Link
                                            href={`/committee/assign-cell-to-teacher/${teacher._id}`}
                                            className="inline-flex items-center px-5 py-2.5 text-xs font-black text-green-700 bg-green-50 rounded-xl hover:bg-green-600 hover:text-white transition-all transform active:scale-95 border border-green-100 shadow-sm"
                                        >
                                            Modify Access
                                            <ArrowRight size={14} className="ml-2" />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-24 text-center text-gray-400 font-bold italic">No faculty members detected in the synchronization database.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CommitteeAllTeachersPage;
