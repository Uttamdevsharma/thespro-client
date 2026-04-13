'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useGetPublicDepartmentsQuery } from '@/store/features/apiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Menu, X, ChevronDown, Home, Info, Mail, LogIn, LayoutDashboard, Search } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';

const MainNavbar = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSupervisorsOpen, setIsSupervisorsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const supervisorsRef = useRef<HTMLDivElement>(null);
  const { data: departments } = useGetPublicDepartmentsQuery();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (supervisorsRef.current && !supervisorsRef.current.contains(event.target as Node)) {
        setIsSupervisorsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSupervisorDeptClick = (deptId: string) => {
    router.push(`/supervisors/${deptId}`);
    setIsSupervisorsOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm py-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            href="/"
            className="flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 bg-[#50C878] rounded-xl flex items-center justify-center shadow-md">
               <img src="/system-logo.png" alt="Logo" className="w-6 h-6 object-contain brightness-0 invert" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">
              Thes<span className="text-[#50C878]">Pro</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
                href="/"
                className={`flex items-center space-x-2 text-xs font-black uppercase tracking-widest transition-all ${pathname === '/' ? 'text-[#50C878]' : 'text-gray-600 dark:text-gray-300 hover:text-[#50C878] dark:hover:text-[#50C878]'}`}
            >
                <Home size={16} />
                <span>Home</span>
            </Link>

            {/* Browse Supervisors Dropdown */}
            <div className="relative" ref={supervisorsRef}>
              <button 
                onMouseEnter={() => setIsSupervisorsOpen(true)}
                className={`flex items-center space-x-2 text-xs font-black uppercase tracking-widest transition-all ${pathname.includes('/supervisors') ? 'text-[#0ea5b7]' : 'text-gray-600 dark:text-gray-300 hover:text-[#0ea5b7] dark:hover:text-[#0ea5b7]'}`}
              >
                <Search size={16} />
                <span>Browse Supervisors</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isSupervisorsOpen ? 'rotate-180' : ''}`} />
              </button>

              <div 
                onMouseLeave={() => setIsSupervisorsOpen(false)}
                className={`absolute top-full left-0 mt-4 w-72 bg-white dark:bg-gray-900 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-gray-800 py-4 transition-all duration-300 origin-top-left ${isSupervisorsOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible'}`}
              >
                <div className="px-5 py-3 border-b border-gray-50 dark:border-gray-800 mb-3">
                  <p className="text-[10px] font-black text-[#0ea5b7] uppercase tracking-[0.2em]">Find Supervisors</p>
                </div>
                <div className="max-h-80 overflow-y-auto custom-scrollbar px-2">
                  {departments?.map((dept: any) => (
                    <button
                      key={dept._id}
                      onClick={() => handleSupervisorDeptClick(dept._id)}
                      className="w-full text-left px-4 py-3.5 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-[#0ea5b7]/5 dark:hover:bg-[#0ea5b7]/10 hover:text-[#0ea5b7] transition-all flex items-center justify-between group rounded-2xl mb-1"
                    >
                      <span>{dept.name}</span>
                      <div className="w-2 h-2 bg-[#0ea5b7] rounded-full scale-0 group-hover:scale-100 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Link 
               href="/about"
               className={`flex items-center space-x-2 text-xs font-black uppercase tracking-widest transition-all ${pathname === '/about' ? 'text-[#50C878]' : 'text-gray-600 dark:text-gray-300 hover:text-[#50C878] dark:hover:text-[#50C878]'}`}
            >
               <Info size={16} />
               <span>About</span>
            </Link>

            <Link 
               href="/contact"
               className={`flex items-center space-x-2 text-xs font-black uppercase tracking-widest transition-all ${pathname === '/contact' ? 'text-[#50C878]' : 'text-gray-600 dark:text-gray-300 hover:text-[#50C878] dark:hover:text-[#50C878]'}`}
            >
               <Mail size={16} />
               <span>Contact</span>
            </Link>

            <ThemeToggle />
            <Link 
              href={user ? `/${user.role}/dashboard` : "/login"}
              className="ml-4 px-6 py-2.5 bg-[#50C878] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-green-100 hover:bg-[#45b66d] hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-2"
            >
              {user ? (
                <>
                  <LayoutDashboard size={14} />
                  Dashboard
                </>
              ) : (
                <>
                  <LogIn size={14} />
                  Portal Login
                </>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <ThemeToggle />
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl transition-all text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-white dark:bg-gray-900 z-[110] transition-transform duration-500 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex justify-between items-center mb-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#50C878] rounded-2xl flex items-center justify-center">
                 <img src="/system-logo.png" alt="Logo" className="w-6 h-6 object-contain brightness-0 invert" />
              </div>
              <span className="text-2xl font-black text-gray-900 dark:text-gray-50 tracking-tight">ThesPro</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 text-gray-400 bg-gray-50 dark:bg-gray-950 rounded-2xl">
              <X size={28} />
            </button>
          </div>

          <div className="space-y-8 flex-grow overflow-y-auto">
             <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-5 text-2xl font-black text-gray-900 dark:text-gray-50 py-2 group">
                <div className="w-12 h-12 bg-gray-50 dark:bg-gray-950 rounded-2xl flex items-center justify-center group-hover:bg-[#50C878]/10 transition-colors">
                  <Home className="text-[#50C878]" size={24} />
                </div>
                <span>Home</span>
             </Link>

             {/* Browse Supervisors Mobile */}
             <div className="space-y-6">
                <div className="flex items-center space-x-5 text-2xl font-black text-gray-900 dark:text-gray-50 py-2">
                   <div className="w-12 h-12 bg-gray-50 dark:bg-gray-950 rounded-2xl flex items-center justify-center">
                    <Search className="text-[#0ea5b7]" size={24} />
                   </div>
                   <span>Browse Supervisors</span>
                </div>
                <div className="pl-16 grid grid-cols-1 gap-4 border-l-2 border-gray-50 dark:border-gray-800/50 ml-6">
                  {departments?.map((dept: any) => (
                    <button 
                      key={dept._id} 
                      onClick={() => handleSupervisorDeptClick(dept._id)}
                      className="text-left text-gray-500 dark:text-gray-400 font-bold text-lg hover:text-[#0ea5b7] transition-colors"
                    >
                      {dept.name}
                    </button>
                  ))}
                </div>
             </div>

             <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-5 text-2xl font-black text-gray-900 dark:text-gray-50 py-2 group">
                <div className="w-12 h-12 bg-gray-50 dark:bg-gray-950 rounded-2xl flex items-center justify-center group-hover:bg-[#50C878]/10 transition-colors">
                   <Info className="text-[#50C878]" size={24} />
                </div>
                <span>About Us</span>
             </Link>

             <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-5 text-2xl font-black text-gray-900 dark:text-gray-50 py-2 group">
                <div className="w-12 h-12 bg-gray-50 dark:bg-gray-950 rounded-2xl flex items-center justify-center group-hover:bg-[#50C878]/10 transition-colors">
                   <Mail className="text-[#50C878]" size={24} />
                </div>
                <span>Contact</span>
             </Link>
          </div>

          <div className="mt-auto pb-12 pt-8">
            <Link 
               href={user ? `/${user.role}/dashboard` : "/login"}
               onClick={() => setIsMobileMenuOpen(false)}
               className="w-full py-5 bg-[#50C878] text-white text-lg font-black rounded-3xl shadow-2xl shadow-green-100 flex items-center justify-center gap-3"
            >
              {user ? (
                <>
                  <LayoutDashboard size={20} />
                  Go to Dashboard
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Portal Login
                </>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNavbar;
