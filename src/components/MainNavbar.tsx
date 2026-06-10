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
    <nav className="sticky top-0 left-0 right-0 z-[100] bg-white/95 dark:bg-slate-900/95 border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[70px]">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-indigo-600 dark:bg-indigo-500 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <img src="/system-logo.png" alt="Logo" className="w-6 h-6 object-contain brightness-0 invert" />
            </div>
            <span className="text-[1.2rem] font-bold tracking-tight text-slate-900 dark:text-white">
              Thes<span className="text-indigo-600 dark:text-indigo-400">Pro</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-[0.875rem] font-semibold tracking-wide transition-colors ${pathname === '/' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
            >
              Home
            </Link>

            <Link
              href="/#features"
              className={`text-[0.875rem] font-semibold tracking-wide transition-colors ${pathname === '/#features' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
            >
              Features
            </Link>

            {/* Supervisors Dropdown */}
            <div className="relative" ref={supervisorsRef}>
              <button
                onClick={() => setIsSupervisorsOpen(!isSupervisorsOpen)}
                onMouseEnter={() => setIsSupervisorsOpen(true)}
                className={`flex items-center space-x-1 text-[0.875rem] font-semibold tracking-wide transition-colors ${pathname.includes('/supervisors') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
              >
                <span>Supervisors</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isSupervisorsOpen ? 'rotate-180' : ''}`} />
              </button>

              <div
                onMouseLeave={() => setIsSupervisorsOpen(false)}
                className={`absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200/80 dark:border-slate-805 py-2 transition-all duration-200 origin-top-left ${isSupervisorsOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible'}`}
              >
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Browse by Department</p>
                </div>
                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                  {departments?.map((dept: any) => (
                    <button
                      key={dept._id}
                      onClick={() => handleSupervisorDeptClick(dept._id)}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-305 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                    >
                      {dept.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/about"
              className={`text-[0.875rem] font-semibold tracking-wide transition-colors ${pathname === '/about' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
            >
              About
            </Link>

            <Link
              href="/contact"
              className={`text-[0.875rem] font-semibold tracking-wide transition-colors ${pathname === '/contact' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
            >
              Contact
            </Link>

            <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800" />

            <ThemeToggle />

            <Link
              href={user ? `/${user.role}/dashboard` : "/login"}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-sm font-semibold rounded-md transition-all active:scale-98 flex items-center gap-2 shadow-sm"
            >
              {user ? (
                <>
                  <LayoutDashboard size={15} />
                  <span>Dashboard</span>
                </>
              ) : (
                <>
                  <LogIn size={15} />
                  <span>Login</span>
                </>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-x-0 top-[71px] bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-md md:hidden transition-all duration-300 ease-in-out z-[90] ${isMobileMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'
          }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-4">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block py-2 text-sm font-semibold border-b border-slate-100 dark:border-slate-850 ${pathname === '/' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'}`}
          >
            Home
          </Link>

          <Link
            href="/#features"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block py-2 text-sm font-semibold border-b border-slate-100 dark:border-slate-850 ${pathname === '/#features' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'}`}
          >
            Features
          </Link>

          {/* Mobile Supervisors Section */}
          <div className="space-y-1">
            <span className="block py-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
              Supervisors
            </span>
            <div className="pl-4 border-l border-slate-200 dark:border-slate-850 space-y-2 max-h-40 overflow-y-auto">
              {departments?.map((dept: any) => (
                <button
                  key={dept._id}
                  onClick={() => handleSupervisorDeptClick(dept._id)}
                  className="block w-full text-left py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 cursor-pointer"
                >
                  {dept.name}
                </button>
              ))}
            </div>
          </div>

          <Link
            href="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block py-2 text-sm font-semibold border-b border-slate-100 dark:border-slate-850 ${pathname === '/about' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'}`}
          >
            About
          </Link>

          <Link
            href="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block py-2 text-sm font-semibold border-b border-slate-100 dark:border-slate-850 ${pathname === '/contact' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'}`}
          >
            Contact
          </Link>

          <Link
            href={user ? `/${user.role}/dashboard` : "/login"}
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-xs font-bold rounded-md flex items-center justify-center gap-2"
          >
            {user ? (
              <>
                <LayoutDashboard size={14} />
                <span>Go to Dashboard</span>
              </>
            ) : (
              <>
                <LogIn size={14} />
                <span>Login</span>
              </>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default MainNavbar;
