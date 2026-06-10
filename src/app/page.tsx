'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthNavbar from '@/components/AuthNavbar';
import { useGetPublicDepartmentsQuery, useGetPublicFacultyByDepartmentQuery, useGetPublicResearchCellsQuery, useGetPublicNoticesQuery, useGetPublicStatsQuery } from '@/store/features/apiSlice';
import SupervisorCard from '@/components/SupervisorCard';
import { ArrowRight, ChevronRight, GraduationCap, Search, ShieldCheck, Bell, UserCheck, ClipboardList, Settings, Users, FileText, LayoutGrid, Plus, Minus, MessageCircle, HelpCircle } from 'lucide-react';
import Loader from '@/components/Loader';
import ScrollReveal from '@/components/ScrollReveal';
import ResearchCellCard from '@/components/ResearchCellCard';
import NoticeSlider from '@/components/NoticeSlider';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);

  const { data: departments, isLoading: deptsLoading } = useGetPublicDepartmentsQuery();
  const { data: allCells, isLoading: cellsLoading } = useGetPublicResearchCellsQuery();
  const { data: notices, isLoading: noticesLoading } = useGetPublicNoticesQuery();
  const { data: stats } = useGetPublicStatsQuery();
  const { data: faculty, isLoading: facultyLoading } = useGetPublicFacultyByDepartmentQuery(selectedDeptId || '', {
    skip: !selectedDeptId,
  });

  useEffect(() => {
    if (departments && departments.length > 0 && !selectedDeptId) {
      setSelectedDeptId(departments[0]._id);
    }
  }, [departments]);

  const features = [
    {
      icon: (
        <div className="w-8 h-8 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#50C878]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.5-3.885 9.38 9.38 0 00-2.5-3.885m-6 7.77a9.38 9.38 0 01-2.5-3.885 9.38 9.38 0 012.5-3.885m-6 7.77a9.38 9.38 0 002.5-3.885 9.38 9.38 0 00-2.5-3.885M12 12a3 3 0 100-6 3 3 0 000 6z" />
          </svg>
        </div>
      ),
      title: 'For Students',
      description: 'Easily submit proposals, track progress, receive feedback, and manage your thesis or project from start to finish. Stay organized and never miss a deadline.',
      highlights: ['Smart Proposal System', 'Progress Tracking', 'Peer Collaboration', 'Real-time Feedback']
    },
    {
      icon: (
        <div className="w-8 h-8 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#50C878]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253" />
          </svg>
        </div>
      ),
      title: 'For Supervisors',
      description: 'Oversee multiple student projects, provide timely feedback, approve milestones, and manage your advisees efficiently. Centralized access to all necessary information.',
      highlights: ['Multi-student Dashboard', 'Research Oversight', 'Instant Communication', 'Progress Analytics']
    },
    {
      icon: (
        <div className="w-8 h-8 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#50C878]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H2v-2a3 3 0 015.356-1.857M17 20v-2c0-.653-.146-1.28-.42-1.857M2 20v-2c0-.653.146-1.28.42-1.857M12 12a3 3 0 100-6 3 3 0 000 6zm-9 6a3 3 0 100-6 3 3 0 000 6zm18 0a3 3 0 100-6 3 3 0 000 6z" />
          </svg>
        </div>
      ),
      title: 'For Committee Members',
      description: 'Access all project proposals, review student progress, and manage research cell assignments with ease. Ensure academic standards are met efficiently.',
      highlights: ['Research Cell Management', 'Quality Assurance', 'Supervisor Assignment', 'Academic Standards']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden font-sans">
      {/* Navigation - Handled by RootLayout */}

      {/* Hero Section */}
      <section className="relative bg-white dark:bg-slate-900 pt-6 pb-10 lg:pt-10 lg:pb-16 border-b border-slate-200/60 dark:border-slate-800/60 transition-colors duration-300 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">

            {/* ── LEFT: Academic Workflow Content ──────────────── */}
            <div
              className={`lg:col-span-5 space-y-5 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              } transition-all duration-700 ease-out`}
            >
              {/* Compact heading */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-[2.1rem] lg:text-[2.4rem] font-bold tracking-tight leading-[1.15] text-slate-900 dark:text-white">
                  Thesis &amp; Research Management{' '}
                  <span className="text-indigo-600 dark:text-indigo-400">for University Departments</span>
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
                  A platform where students, supervisors, and committees manage the full thesis lifecycle — from proposal to final defense.
                </p>
              </div>

              {/* Thesis Lifecycle Pipeline — compact */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                  Thesis Lifecycle
                </p>
                <div className="flex flex-col">
                  {[
                    { step: '01', label: 'Proposal Submission',  note: 'Student drafts & uploads research proposal' },
                    { step: '02', label: 'Supervisor Review',     note: 'Faculty supervisor evaluates & endorses' },
                    { step: '03', label: 'Committee Approval',    note: 'Academic council grants final authorization' },
                    { step: '04', label: 'Defense Scheduling',    note: 'Defense board date & panel coordinated' },
                    { step: '05', label: 'Final Evaluation',      note: 'Grading, results published & archived' },
                  ].map((item, idx, arr) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shrink-0">
                          <span className="text-[8px] font-bold text-indigo-600 dark:text-indigo-400">{item.step}</span>
                        </div>
                        {idx < arr.length - 1 && (
                          <div className="w-px h-4 bg-slate-200 dark:bg-slate-800" />
                        )}
                      </div>
                      <div className="pb-1.5">
                        <p className="text-[11.5px] font-semibold text-slate-800 dark:text-slate-200 leading-tight">{item.label}</p>
                        <p className="text-[10.5px] text-slate-400 dark:text-slate-500 leading-snug">{item.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Stats Bar — compact */}
              <div className="flex items-center gap-5 py-2.5 border-t border-b border-slate-200/60 dark:border-slate-800/60">
                <div>
                  <p className="text-base font-bold text-slate-900 dark:text-white leading-none">{stats?.studentCount ?? '—'}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">Students</p>
                </div>
                <div className="w-px h-7 bg-slate-200 dark:bg-slate-800" />
                <div>
                  <p className="text-base font-bold text-slate-900 dark:text-white leading-none">{stats?.supervisorCount ?? '—'}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">Supervisors</p>
                </div>
                <div className="w-px h-7 bg-slate-200 dark:bg-slate-800" />
                <div>
                  <p className="text-base font-bold text-slate-900 dark:text-white leading-none">{stats?.deptCount ?? '—'}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">Departments</p>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-sm font-semibold rounded-md shadow-sm transition-all active:scale-[0.98]"
                >
                  Get Started
                </Link>
                <Link
                  href="/about"
                  className="px-5 py-2.5 bg-transparent border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-[0.98]"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* ── RIGHT: Floating image ────────────────────────── */}
            <div
              className={`lg:col-span-7 flex items-center justify-center lg:justify-end lg:-mt-14 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              } transition-all duration-700 delay-150 ease-out`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero-right-final.png"
                alt="Academic thesis workspace flat-lay with proposal documents, supervisor comments, defense calendar, and research notes"
                className="hero-image w-full max-w-[600px] lg:max-w-[112%] xl:max-w-[118%] h-auto object-contain select-none pointer-events-none lg:-mr-16 xl:-mr-20"
                draggable={false}
              />
            </div>

          </div>
        </div>
      </section>

      {/* Explore by Department Section */}
      <ScrollReveal>
        <section className="py-24 bg-slate-50/50 dark:bg-slate-950/20 relative overflow-hidden border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/60 dark:border-indigo-900/40 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
                <GraduationCap size={14} />
                <span>Academic Departments</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                Explore by <span className="text-indigo-600 dark:text-indigo-400">Department</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-normal">
                Discover top supervisors and researchers from our diverse academic departments, 
                each bringing unique expertise to your project.
              </p>
            </div>

            {/* Department Selection Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              {deptsLoading ? (
                <div className="flex gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-12 w-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full" />
                  ))}
                </div>
              ) : (
                departments?.map((dept: any) => (
                  <button
                    key={dept._id}
                    onClick={() => setSelectedDeptId(dept._id)}
                    className={`px-8 py-3.5 rounded-full text-sm font-bold transition-all duration-300 border-2 ${
                      selectedDeptId === dept._id
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10 scale-105'
                        : 'bg-white dark:bg-slate-950 border-slate-200/60 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50/30 dark:hover:bg-slate-900'
                    }`}
                  >
                    {dept.name}
                  </button>
                ))
              )}
            </div>

            {/* Supervisor Grid */}
            <div className="min-h-[400px]">
              {facultyLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-[380px] bg-white dark:bg-slate-900 rounded-xl animate-pulse shadow-sm border border-slate-100 dark:border-slate-800" />
                  ))}
                </div>
              ) : faculty && faculty.length > 0 ? (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {faculty.slice(0, 4).map((member: any) => (
                      <div key={member._id} className="h-full">
                        <SupervisorCard member={member} />
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-center">
                    <Link
                      href={`/supervisors/${selectedDeptId}`}
                      className="group flex items-center space-x-3 px-8 py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-md font-semibold text-sm hover:bg-indigo-600 dark:hover:bg-indigo-700 transition-all duration-300 active:scale-95 shadow-sm"
                    >
                      <span>View All Supervisors</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 bg-white dark:bg-slate-950 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-slate-400 dark:text-slate-500 font-bold text-lg">No supervisors found in this department yet.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Explore by Research Cells Section */}
      <ScrollReveal>
        <section className="py-24 bg-white dark:bg-slate-900 relative overflow-hidden border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/60 dark:border-indigo-900/40 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
                <Search size={14} />
                <span>Specialized Interests</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                Explore by <span className="text-indigo-600 dark:text-indigo-400">Research Cells</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-normal">
                Find your perfect match by exploring specific research areas across all academic departments.
              </p>
            </div>

            {/* Department Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {deptsLoading ? (
                <div className="h-10 w-48 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-full" />
              ) : (
                departments?.map((dept: any) => (
                  <button
                    key={dept._id}
                    onClick={() => setSelectedDeptId(dept._id)}
                    className={`px-6 py-2.5 rounded-full text-xs font-semibold transition-all duration-300 border ${
                      selectedDeptId === dept._id
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-950 border-slate-200/60 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50/20'
                    }`}
                  >
                    {dept.name}
                  </button>
                ))
              )}
            </div>

            {/* Cells Grid */}
            <div className="min-h-[200px]">
              {cellsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-24 bg-slate-50 dark:bg-slate-950 animate-pulse rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {allCells?.filter((cell: any) => cell.department === selectedDeptId).map((cell: any) => (
                    <ResearchCellCard 
                      key={cell._id} 
                      cell={cell} 
                      departmentName={departments?.find((d: any) => d._id === selectedDeptId)?.name}
                      selectedDeptId={selectedDeptId}
                    />
                  ))}
                  
                  {allCells?.filter((cell: any) => cell.department === selectedDeptId).length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-400 dark:text-slate-500 font-semibold">
                      No research cells registered for this department yet.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Latest Notices Section */}
      <ScrollReveal>
        <section className="py-24 bg-slate-50/50 dark:bg-slate-950/20 relative overflow-hidden border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-4">
              <div className="max-w-2xl">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/60 dark:border-indigo-900/40 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
                    <Bell size={14} />
                    <span>Announcements</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                    Stay Updated with <span className="text-indigo-600 dark:text-indigo-400">Latest Notices</span>
                </h2>
                <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-normal">
                    Important updates, academic schedule changes, and official announcements from the Committee.
                </p>
              </div>
              
              <div className="hidden md:flex space-x-2">
                <div className="h-1.5 w-12 bg-indigo-600 rounded-full" />
                <div className="h-1.5 w-4 bg-slate-200 dark:bg-slate-800 rounded-full" />
                <div className="h-1.5 w-4 bg-slate-200 dark:bg-slate-800 rounded-full" />
              </div>
            </div>

            <div className="min-h-[400px]">
              {noticesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-80 bg-white dark:bg-slate-950 rounded-xl animate-pulse border border-slate-100 dark:border-slate-900" />
                  ))}
                </div>
              ) : (
                <NoticeSlider notices={notices || []} />
              )}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* How It Works Section */}
      <ScrollReveal>
        <section id="features" className="py-24 bg-white dark:bg-slate-900 relative overflow-hidden border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/60 dark:border-indigo-900/40 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
                <Settings size={14} />
                <span>Process Overview</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                How It <span className="text-indigo-600 dark:text-indigo-400">Works</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-normal">
                A seamless step-by-step journey designed to streamline your academic research and approval process.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'Register / Login', desc: 'Join the platform as a student or faculty member and securely access your dashboard.', icon: <UserCheck className="text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" size={24} /> },
                { title: 'Complete Profile', desc: 'Fill in your academic details and research interests to get personalized recommendations.', icon: <ClipboardList className="text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" size={24} /> },
                { title: 'Submit Proposal', desc: 'Draft and upload your thesis or project proposal for formal review.', icon: <FileText className="text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" size={24} /> },
                { title: 'Supervisor Review', desc: 'Assigned supervisors will provide feedback and guide your initial proposal.', icon: <Users className="text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" size={24} /> },
                { title: 'Committee Approval', desc: 'The academic committee reviews and provides final authorization for your work.', icon: <GraduationCap className="text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" size={24} /> },
                { title: 'Defense', desc: 'Present your completed research to the defense board for final evaluation and grading.', icon: <ShieldCheck className="text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" size={24} /> }
              ].map((step, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-950 p-8 rounded-xl border border-slate-200/60 dark:border-slate-800/80 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-300 shadow-sm hover:shadow-md group">
                  <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-all duration-300">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{idx + 1}. {step.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* System Statistics Section */}
      <ScrollReveal>
        <section className="py-24 bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-200/60 dark:border-slate-800/60 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-16">
              Our Growth in <span className="text-indigo-600 dark:text-indigo-400">Numbers</span>
            </h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'Total Students', value: stats?.studentCount || 0, icon: <Users size={24} /> },
                { label: 'Supervisors', value: stats?.supervisorCount || 0, icon: <GraduationCap size={24} /> },
                { label: 'Departments', value: stats?.deptCount || 0, icon: <LayoutGrid size={24} /> },
                { label: 'Proposals', value: stats?.proposalCount || 0, icon: <FileText size={24} /> }
              ].map((stat, idx) => (
                <div key={idx} className="p-8 bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group shadow-sm">
                  <div className="text-indigo-600 dark:text-indigo-400 mb-4 flex justify-center group-hover:scale-110 transition-transform">{stat.icon}</div>
                  <div className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-2">{stat.value}</div>
                  <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* FAQ Section */}
      <ScrollReveal>
        <section className="py-24 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/60 dark:border-indigo-900/40 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
                <HelpCircle size={14} />
                <span>Common Inquiries</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                Curious? <span className="text-indigo-600 dark:text-indigo-400">FAQs</span>
              </h2>
            </div>

            <div className="space-y-4">
              {[
                { q: 'How to submit a proposal?', a: 'Log in as a student, navigate to the Proposals tab in your dashboard, and click "New Proposal". Fill in the title, abstract, and select your preferred supervisor.' },
                { q: 'How to choose a supervisor?', a: 'Browse the "Explore" sections on the homepage to find supervisors based on department or research cells. You can view their profiles and assigned cells before making a selection.' },
                { q: 'How does approval work?', a: 'Once submitted, your supervisor reviews the proposal. If approved, it is forwarded to the Academic Committee for final authorization.' },
                { q: 'How to join a research cell?', a: 'Research cells are managed by supervisors. You can apply to work under a specific cell when submitting your proposal or by contacting the cell coordinator.' }
              ].map((faq, idx) => {
                const [isOpen, setIsOpen] = useState(false);
                return (
                  <div key={idx} className="border border-slate-200/60 dark:border-slate-800/80 rounded-xl overflow-hidden">
                    <button 
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-colors bg-white dark:bg-slate-950"
                    >
                      <span className="text-base font-bold text-slate-900 dark:text-slate-200">{faq.q}</span>
                      {isOpen ? <Minus size={18} className="text-indigo-600 dark:text-indigo-400" /> : <Plus size={18} className="text-slate-400" />}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 text-slate-500 dark:text-slate-400 font-normal leading-relaxed animate-in slide-in-from-top-2 duration-300 bg-white dark:bg-slate-950">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Final CTA Section */}
      <ScrollReveal threshold={0.5}>
        <section className="py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/60 dark:border-slate-800/60 relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
                Start Your <span className="text-indigo-600 dark:text-indigo-400">Thesis Journey</span> Today
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
                Join a community of scholars and streamline your academic research with ThesPro's automated management system.
              </p>
              <div className="pt-8">
                <Link 
                  href="/register" 
                  className="px-12 py-5 bg-indigo-600 text-white rounded-md font-semibold text-lg hover:bg-indigo-700 transition-all duration-300 inline-flex items-center space-x-3 active:scale-95 shadow-sm"
                >
                  <span>Get Started Now</span>
                  <ArrowRight size={22} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.172L21 21l-9.875-9.875M11.42 15.172a2.5 2.5 0 11-4.005-3.32A2.5 2.5 0 0111.42 15.172z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">ThesPro</span>
              </div>
              <p className="text-slate-550 dark:text-slate-400">
                Empowering academic excellence through innovative thesis and project management.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900 dark:text-white">Quick Links</h4>
              <ul className="space-y-2 text-slate-500 dark:text-slate-400">
                <li><Link href="/about" className="hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors">About Us</Link></li>
                <li><Link href="/features" className="hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors">Features</Link></li>
                <li><Link href="/support" className="hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors">Support</Link></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900 dark:text-white">Legal</h4>
              <ul className="space-y-2 text-slate-500 dark:text-slate-400">
                <li><Link href="/privacy" className="hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-200/60 dark:border-slate-800/80 pt-8 mt-8 text-center text-slate-400 dark:text-slate-500">
            <p>&copy; 2025 ThesPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
