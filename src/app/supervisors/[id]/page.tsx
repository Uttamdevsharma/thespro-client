'use client';

import React, { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { 
    useGetPublicFacultyByDepartmentQuery, 
    useGetPublicDepartmentsQuery,
    useGetPublicResearchCellsQuery
} from '@/store/features/apiSlice';
import CardGridSkeleton from '@/components/CardGridSkeleton';
import Link from 'next/link';
import { Search, Filter, ShieldCheck, ChevronRight, X } from 'lucide-react';
import SupervisorCard from '@/components/SupervisorCard';

const SupervisorsListPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialCell = searchParams.get('cell') || '';
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCell, setSelectedCell] = useState(initialCell);

    const { data: faculty, isLoading: facultyLoading } = useGetPublicFacultyByDepartmentQuery(id as string);
    const { data: departments } = useGetPublicDepartmentsQuery();
    const { data: cells } = useGetPublicResearchCellsQuery();

    const currentDept = departments?.find((d: any) => d._id === id);
    const deptLabel = currentDept?.abbreviation || currentDept?.name || 'Department';
    
    // Filter cells that belong to the current department
    const deptCells = cells?.filter((cell: any) => cell.department === id);

    // Filtering logic
    const filteredFaculty = faculty?.filter((member: any) => {
        const matchesName = member.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCell = selectedCell === '' || member.researchCells?.some((cell: any) => cell._id === selectedCell);
        return matchesName && matchesCell;
    });

    if (facultyLoading) return <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8"><CardGridSkeleton columns={4} rows={2} /></div>;

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-20 font-sans">
            {/* Top Breadcrumb & Search Bar */}
            <div className="bg-gray-50 dark:bg-gray-950 border-y border-gray-100 dark:border-gray-800 py-8 mb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center space-x-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                                <Link href="/" className="hover:text-[#0ea5b7] transition-colors">Home</Link>
                                <ChevronRight size={12} />
                                <span className="text-gray-900 dark:text-gray-50">{deptLabel}</span>
                            </div>
                            <h1 className="text-4xl font-black text-gray-900 dark:text-gray-50 leading-tight">
                                Browse <span className="text-[#0ea5b7]">Supervisors</span>
                            </h1>
                        </div>

                        {/* HIGH VISIBILITY SEARCH */}
                        <div className="relative w-full lg:max-w-md">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0ea5b7] transition-colors">
                                <Search size={22} />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search by name..."
                                className="w-full pl-14 pr-6 py-4 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-50 placeholder:text-gray-400 rounded-2xl focus:border-[#0ea5b7] focus:ring-4 focus:ring-[#0ea5b7]/10 transition-all outline-none font-bold shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button 
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-300"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* LEFT SIDEBAR FILTERS */}
                    <aside className="w-full lg:w-72 shrink-0">
                        <div className="bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 sticky top-32 shadow-sm">
                            <div className="flex items-center space-x-3 mb-8">
                                <Filter size={20} className="text-[#0ea5b7]" />
                                <h3 className="text-lg font-black text-gray-900 dark:text-gray-50 uppercase tracking-tight">Research Cells</h3>
                            </div>

                            <div className="space-y-2">
                                <button 
                                    onClick={() => setSelectedCell('')}
                                    className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-black transition-all flex items-center justify-between group ${selectedCell === '' ? 'bg-[#0ea5b7] text-white shadow-lg shadow-cyan-100' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-950 hover:text-gray-900 dark:text-gray-50'}`}
                                >
                                    <span>All Research Areas</span>
                                    {selectedCell === '' && <div className="w-2 h-2 bg-white dark:bg-gray-900 rounded-full" />}
                                </button>

                                {deptCells?.map((cell: any) => (
                                    <button 
                                        key={cell._id}
                                        onClick={() => setSelectedCell(cell._id)}
                                        className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-black transition-all flex items-center justify-between group ${selectedCell === cell._id ? 'bg-[#1a2b3c] text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-950 hover:text-gray-900 dark:text-gray-50'}`}
                                    >
                                        <span className="truncate pr-2">{cell.title}</span>
                                        {selectedCell === cell._id && <div className="w-2 h-2 bg-[#0ea5b7] rounded-full" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* RIGHT SIDE: SUPERVISOR GRID (4 COLUMNS - RESTORED DESIGN) */}
                    <main className="flex-grow">
                        {filteredFaculty && filteredFaculty.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                                {filteredFaculty.map((member: any) => (
                                    <SupervisorCard key={member._id} member={member} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-24 text-center bg-gray-50 dark:bg-gray-950 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
                                <h2 className="text-xl font-black text-gray-800 dark:text-gray-100 mb-2">No Match Found</h2>
                                <p className="text-gray-400 font-bold text-sm">Adjust your filters to see more supervisors.</p>
                                <button 
                                    onClick={() => { setSearchTerm(''); setSelectedCell(''); }}
                                    className="mt-4 text-[#0ea5b7] font-black text-sm hover:underline"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
            
            {/* Scroll top button */}
            <div className="fixed bottom-10 right-10 z-50">
               <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="w-12 h-12 bg-[#0ea5b7] text-white rounded-lg flex items-center justify-center shadow-lg hover:bg-[#00838f] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                  </svg>
               </button>
            </div>
        </div>
    );
};

export default SupervisorsListPage;
