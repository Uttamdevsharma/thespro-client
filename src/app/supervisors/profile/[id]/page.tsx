'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useGetPublicFacultyProfileQuery } from '@/store/features/apiSlice';
import { 
    Mail, 
    ChevronLeft, 
    GraduationCap, 
    Briefcase, 
    Search, 
    BookOpen, 
    Calendar,
    Award,
    Dna
} from 'lucide-react';
import Loader from '@/components/Loader';

const SupervisorProfilePage = () => {
    const { id } = useParams();
    const router = useRouter();
    const { data: member, isLoading } = useGetPublicFacultyProfileQuery(id as string);
    const [activeTab, setActiveTab] = useState('education');

    if (isLoading) return <Loader />;
    if (!member) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-black text-gray-800 dark:text-gray-100">Supervisor Not Found</h1>
                <button 
                    onClick={() => router.back()}
                    className="mt-4 px-6 py-2 bg-[#0ea5b7] text-white rounded-xl font-bold"
                >
                    Go Back
                </button>
            </div>
        </div>
    );

    const tabs = [
        { id: 'education', label: 'Education', icon: GraduationCap },
        { id: 'experience', label: 'Experience', icon: Briefcase },
        { id: 'research', label: 'Research', icon: Search },
    ];

    const renderTabContent = () => {
        const contentClass = "bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-4 duration-500";
        switch (activeTab) {
            case 'education':
                return (
                    <div className={contentClass}>
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                <GraduationCap size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-gray-50">Academic Background</h2>
                        </div>
                        <div className="whitespace-pre-wrap text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                            {member.education || "Academic credentials not provided."}
                        </div>
                    </div>
                );
            case 'experience':
                return (
                    <div className={contentClass}>
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                                <Briefcase size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-gray-50">Professional Experience</h2>
                        </div>
                        <div className="whitespace-pre-wrap text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                            {member.experience || "Experience details not shared."}
                        </div>
                    </div>
                );
            case 'research':
                return (
                    <div className={contentClass}>
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                                <BookOpen size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-gray-50">Research Interests</h2>
                        </div>
                        <div className="whitespace-pre-wrap text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                            {member.research || "Research focus points not specified."}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-32 pb-20 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button 
                    onClick={() => router.back()}
                    className="flex items-center space-x-2 text-sm font-black text-gray-400 hover:text-[#0ea5b7] transition-colors mb-12"
                >
                    <ChevronLeft size={20} />
                    <span>BACK TO LISTING</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Profile Overview */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                        <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-10 shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-50 rounded-full -mr-20 -mt-20 -z-0" />
                            
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-48 h-48 rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl bg-gray-100 mb-8 transform hover:scale-105 transition-transform duration-500">
                                    {member.profilePicture ? (
                                        <img src={member.profilePicture} alt={member.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#0ea5b7] text-6xl font-black uppercase tracking-tighter">
                                            {member.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <h1 className="text-3xl font-black text-gray-900 dark:text-gray-50 mb-2 leading-tight">{member.name}</h1>
                                <p className="text-sm font-black text-[#0ea5b7] uppercase tracking-[0.2em] mb-8">{member.designation}</p>
                                
                                <div className="w-full h-px bg-gray-50 dark:bg-gray-950 mb-8" />
                                
                                <div className="w-full space-y-6">
                                    <div className="flex items-center justify-center space-x-3 text-gray-600 dark:text-gray-300">
                                        <div className="w-10 h-10 bg-gray-50 dark:bg-gray-950 rounded-xl flex items-center justify-center text-gray-400">
                                            <Mail size={18} />
                                        </div>
                                        <span className="font-bold truncate text-sm">{member.email}</span>
                                    </div>
                                    <div className="flex items-center justify-center space-x-3 text-gray-600 dark:text-gray-300">
                                        <div className="w-10 h-10 bg-gray-50 dark:bg-gray-950 rounded-xl flex items-center justify-center text-gray-400">
                                            <GraduationCap size={18} />
                                        </div>
                                        <span className="font-bold text-sm">{member.department?.abbreviation || member.department?.name}</span>
                                    </div>
                                </div>

                                <Link 
                                    href={`/contact?faculty=${member.name}`}
                                    className="w-full mt-10 py-5 bg-[#0ea5b7] text-white font-black rounded-2xl shadow-xl shadow-cyan-100 hover:bg-[#00838f] transition-all hover:-translate-y-1 block"
                                >
                                    Connect in Portal
                                </Link>
                            </div>
                        </div>

                        {/* Assigned Cells Section */}
                        <div className="mt-8 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-lg border border-gray-100 dark:border-gray-800">
                             <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
                                    <Dna size={20} />
                                </div>
                                <h3 className="text-lg font-black text-gray-900 dark:text-gray-50">Research Cell Assignments</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {member.researchCells && member.researchCells.length > 0 ? (
                                    member.researchCells.map((cell: any) => (
                                        <span key={cell._id} className="px-4 py-2 bg-gray-50 dark:bg-gray-950 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-800 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm">
                                            {cell.title}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-sm font-bold text-gray-400 italic">No cells assigned yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Detailed Tabs */}
                    <div className="lg:col-span-8">
                        <div className="flex p-2 bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 mb-10 overflow-x-auto no-scrollbar">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 flex items-center justify-center space-x-3 py-4 px-6 rounded-2xl font-black text-sm transition-all whitespace-nowrap ${isActive ? 'bg-[#0ea5b7] text-white shadow-lg' : 'text-gray-400 hover:text-gray-900 dark:text-gray-50'}`}
                                    >
                                        <Icon size={18} />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tab Content */}
                        {renderTabContent()}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
                                <Award className="text-[#0ea5b7] mb-4" size={32} />
                                <h4 className="text-xl font-black text-gray-900 dark:text-gray-50 mb-2">Academic Honors</h4>
                                <p className="text-gray-500 dark:text-gray-400 font-bold text-sm">Recognized for significant contributions to the field of research.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
                                <Calendar className="text-[#0ea5b7] mb-4" size={32} />
                                <h4 className="text-xl font-black text-gray-900 dark:text-gray-50 mb-2">Availability</h4>
                                <p className="text-gray-500 dark:text-gray-400 font-bold text-sm">Available for supervision and consultation during university hours.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupervisorProfilePage;
