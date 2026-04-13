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
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Fixed/Parallax-like feel */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/home-back.jpg')" }}
        />
        
        {/* Dark Professional Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center z-20">
          <div className={`space-y-10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-1000 ease-out`}>
            {/* Tagline */}
            <div className="inline-flex items-center px-4 py-2 bg-[#50C878]/20 border border-[#50C878]/30 rounded-full text-[#50C878] text-xs font-black uppercase tracking-[0.2em]">
              The Ultimate Academic Management Suite
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-8xl font-black text-white leading-[1.1] tracking-tighter">
                Manage Your Thesis <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#50C878] to-[#a8e6cf]">
                  Journey Efficiently
                </span>
              </h1>

              <p className="text-lg lg:text-2xl text-gray-300 max-w-3xl mx-auto font-medium leading-relaxed">
                A comprehensive ecosystem for students, supervisors, and research committees 
                to collaborate, track, and excel in academic research projects.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-6">
              <Link 
                href="/register" 
                className="group px-10 py-5 bg-[#50C878] text-white text-lg font-black rounded-full shadow-2xl shadow-green-900/20 hover:bg-[#45b66d] hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3"
              >
                <span>Get Started Now</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>

              <Link 
                href="/about" 
                className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-lg font-black rounded-full hover:bg-white/20 transition-all flex items-center justify-center min-w-[200px]"
              >
                Explore System
              </Link>
            </div>

            {/* Helper Text */}
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest pt-4">
              Join <span className="text-white">500+</span> active researchers today
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#50C878]/10 rounded-full blur-[120px] z-0" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#50C878]/5 rounded-full blur-[120px] z-0" />
      </section>

      {/* Explore by Department Section */}
      <ScrollReveal>
        <section className="py-24 bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/50 to-transparent pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cyan-50 border border-cyan-100 rounded-full text-[#0ea5b7] text-xs font-black uppercase tracking-widest mb-4">
                <GraduationCap size={14} />
                <span>Academic Departments</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-gray-50 mb-6">
                Explore by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5b7] to-cyan-400">Department</span>
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
                Discover top supervisors and researchers from our diverse academic departments, 
                each bringing unique expertise to your project.
              </p>
            </div>

            {/* Department Selection Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              {deptsLoading ? (
                <div className="flex gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-12 w-32 bg-gray-200 animate-pulse rounded-full" />
                  ))}
                </div>
              ) : (
                departments?.map((dept: any) => (
                  <button
                    key={dept._id}
                    onClick={() => setSelectedDeptId(dept._id)}
                    className={`px-8 py-3.5 rounded-full text-sm font-black transition-all duration-300 border-2 ${
                      selectedDeptId === dept._id
                        ? 'bg-[#0ea5b7] border-[#0ea5b7] text-white shadow-xl shadow-cyan-200 scale-105'
                        : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400 hover:border-[#0ea5b7] hover:text-[#0ea5b7] hover:bg-cyan-50'
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
                    <div key={i} className="h-[380px] bg-white dark:bg-gray-900 rounded-2xl animate-pulse shadow-sm border border-gray-100 dark:border-gray-800" />
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
                      className="group flex items-center space-x-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-[#0ea5b7] hover:shadow-2xl hover:shadow-cyan-200 transition-all duration-300 active:scale-95"
                    >
                      <span>View All Supervisors</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
                  <p className="text-gray-400 font-bold text-lg">No supervisors found in this department yet.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Explore by Research Cells Section */}
      <ScrollReveal>
        <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-green-50 border border-green-100 rounded-full text-[#50C878] text-xs font-black uppercase tracking-widest mb-4">
                <Search size={14} />
                <span>Specialized Interests</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-gray-50 mb-6">
                Explore by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#50C878] to-[#a8e6cf]">Research Cells</span>
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
                Find your perfect match by exploring specific research areas across all academic departments.
              </p>
            </div>

            {/* Department Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {deptsLoading ? (
                <div className="h-10 w-48 bg-gray-100 animate-pulse rounded-full" />
              ) : (
                departments?.map((dept: any) => (
                  <button
                    key={dept._id}
                    onClick={() => setSelectedDeptId(dept._id)}
                    className={`px-6 py-2.5 rounded-full text-xs font-black transition-all duration-300 border ${
                      selectedDeptId === dept._id
                        ? 'bg-[#1a2b3c] border-[#1a2b3c] text-white shadow-lg'
                        : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400 hover:border-[#50C878] hover:text-[#50C878]'
                    }`}
                  >
                    {dept.name}
                  </button>
                ))
              )}
            </div>

            {/* Cells Carousel/Grid */}
            <div className="min-h-[200px]">
              {cellsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-24 bg-gray-50 dark:bg-gray-950 animate-pulse rounded-2xl" />
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
                    <div className="col-span-full py-12 text-center text-gray-400 font-bold">
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
        <section className="py-24 bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
          {/* Subtle background texture */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#1e40af 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-4">
              <div className="max-w-2xl">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-xs font-black uppercase tracking-widest mb-4">
                    <Bell size={14} />
                    <span>Announcements</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-gray-50 mb-6">
                    Stay Updated with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Latest Notices</span>
                </h2>
                <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
                    Important updates, academic schedule changes, and official announcements from the Committee.
                </p>
              </div>
              
              <div className="hidden md:flex space-x-2">
                <div className="h-1.5 w-12 bg-blue-600 rounded-full" />
                <div className="h-1.5 w-4 bg-gray-200 rounded-full" />
                <div className="h-1.5 w-4 bg-gray-200 rounded-full" />
              </div>
            </div>

            <div className="min-h-[400px]">
              {noticesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-80 bg-white dark:bg-gray-900 rounded-[2rem] animate-pulse border border-gray-100 dark:border-gray-800" />
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
        <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-orange-50 border border-orange-100 rounded-full text-orange-600 text-xs font-black uppercase tracking-widest mb-4">
                <Settings size={14} />
                <span>Process Overview</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-gray-50 mb-6">
                How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">Works</span>
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
                A seamless step-by-step journey designed to streamline your academic research and approval process.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'Register / Login', desc: 'Join the platform as a student or faculty member and securely access your dashboard.', icon: <UserCheck className="text-orange-600" size={24} /> },
                { title: 'Complete Profile', desc: 'Fill in your academic details and research interests to get personalized recommendations.', icon: <ClipboardList className="text-orange-600" size={24} /> },
                { title: 'Submit Proposal', desc: 'Draft and upload your thesis or project proposal for formal review.', icon: <FileText className="text-orange-600" size={24} /> },
                { title: 'Supervisor Review', desc: 'Assigned supervisors will provide feedback and guide your initial proposal.', icon: <Users className="text-orange-600" size={24} /> },
                { title: 'Committee Approval', desc: 'The academic committee reviews and provides final authorization for your work.', icon: <GraduationCap className="text-orange-600" size={24} /> },
                { title: 'Defense', desc: 'Present your completed research to the defense board for final evaluation and grading.', icon: <ShieldCheck className="text-orange-600" size={24} /> }
              ].map((step, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border-2 border-gray-50 dark:border-gray-800/50 hover:border-orange-200 transition-all duration-300 shadow-sm hover:shadow-xl group">
                  <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-gray-50 mb-3">{idx + 1}. {step.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
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
        <section className="py-24 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-transparent relative overflow-hidden">
          {/* Decorative glowing circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-16">
              Our Growth in <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400">Numbers</span>
            </h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'Total Students', value: stats?.studentCount || 0, icon: <Users size={24} /> },
                { label: 'Supervisors', value: stats?.supervisorCount || 0, icon: <GraduationCap size={24} /> },
                { label: 'Departments', value: stats?.deptCount || 0, icon: <LayoutGrid size={24} /> },
                { label: 'Proposals', value: stats?.proposalCount || 0, icon: <FileText size={24} /> }
              ].map((stat, idx) => (
                <div key={idx} className="p-8 bg-gray-50 dark:bg-white/5 backdrop-blur-sm border border-gray-100 dark:border-white/10 rounded-3xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group">
                  <div className="text-purple-600 dark:text-purple-400 mb-4 flex justify-center group-hover:scale-110 transition-transform">{stat.icon}</div>
                  <div className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-2">{stat.value}</div>
                  <div className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* FAQ Section */}
      <ScrollReveal>
        <section className="py-24 bg-white dark:bg-gray-900">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-xs font-black uppercase tracking-widest mb-4">
                <HelpCircle size={14} />
                <span>Common Inquiries</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-gray-50 mb-6 font-sans">
                Curious? <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">FAQs</span>
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
                  <div key={idx} className="border-2 border-gray-50 dark:border-gray-800/50 rounded-2xl overflow-hidden">
                    <button 
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:bg-gray-950 transition-colors"
                    >
                      <span className="text-lg font-black text-gray-900 dark:text-gray-50">{faq.q}</span>
                      {isOpen ? <Minus size={20} className="text-blue-600" /> : <Plus size={20} className="text-gray-400" />}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 text-gray-500 dark:text-gray-400 font-medium leading-relaxed animate-in slide-in-from-top-2 duration-300">
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
        <section className="py-24 bg-blue-50 dark:bg-gradient-to-br dark:from-[#1a2b3c] dark:to-[#04080f] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 dark:opacity-20" />
          
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white leading-tight">
                Start Your <span className="text-[#50C878]">Thesis Journey</span> Today
              </h2>
              <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
                Join a community of scholars and streamline your academic research with ThesPro's automated management system.
              </p>
              <div className="pt-8">
                <Link 
                  href="/register" 
                  className="px-12 py-5 bg-[#50C878] text-white rounded-2xl font-black text-lg hover:bg-green-600 hover:shadow-[0_20px_40px_rgba(80,200,120,0.3)] hover:-translate-y-1 transition-all duration-300 inline-flex items-center space-x-3 active:scale-95"
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
      <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#50C878] rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.172L21 21l-9.875-9.875M11.42 15.172a2.5 2.5 0 11-4.005-3.32A2.5 2.5 0 0111.42 15.172z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">ThesPro</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Empowering academic excellence through innovative thesis and project management.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">Quick Links</h4>
              <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                <li><Link href="/about" className="hover:text-[#50C878] dark:hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/features" className="hover:text-[#50C878] dark:hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/support" className="hover:text-[#50C878] dark:hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">Legal</h4>
              <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                <li><Link href="/privacy" className="hover:text-[#50C878] dark:hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[#50C878] dark:hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-[#50C878] dark:hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-100 dark:border-gray-900 pt-8 mt-8 text-center text-gray-400 dark:text-gray-500">
            <p>&copy; 2025 ThesPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
