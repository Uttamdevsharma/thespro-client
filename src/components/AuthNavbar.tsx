'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/features/userSlice';
import { useRouter } from 'next/navigation';
import { Menu, X, LogOut, User as UserIcon, ChevronDown, LayoutDashboard } from 'lucide-react';
import NotificationBell from './NotificationBell';
import { ThemeToggle } from './ThemeToggle';
import CycleSelector from './CycleSelector';
import { useUI } from '@/contexts/UIContext';

const AuthNavbar = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const { toggleSidebar } = useUI();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
    router.push('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitial = () => user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <nav className="sticky top-0 left-0 right-0 z-[100] bg-white/95 dark:bg-slate-900/95 border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[70px]">

          {/* Left: hamburger (mobile) + Logo */}
          <div className="flex items-center gap-3">
            {/* Sidebar toggle — mobile only */}
            {user && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors md:hidden"
                title="Toggle Sidebar"
              >
                <Menu size={20} />
              </button>
            )}

            {/* Logo — identical to MainNavbar */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-indigo-600 dark:bg-indigo-500 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                <img src="/system-logo.png" alt="Logo" className="w-6 h-6 object-contain brightness-0 invert" />
              </div>
              <span className="text-[1.2rem] font-bold tracking-tight text-slate-900 dark:text-white">
                Thes<span className="text-indigo-600 dark:text-indigo-400">Pro</span>
              </span>
            </Link>
          </div>

          {/* Right: auth tools */}
          <div className="flex items-center gap-3">
            <CycleSelector />
            <ThemeToggle />

            {user && <NotificationBell />}

            {user ? (
              /* Authenticated user dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white text-sm font-bold overflow-hidden border-2 border-indigo-100 dark:border-indigo-900">
                    {user.profilePicture
                      ? <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                      : getInitial()
                    }
                  </div>
                  {/* Name + role (hidden on xs) */}
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-[12px] font-semibold text-slate-800 dark:text-slate-200 leading-tight">{user.name}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">{user.role}</span>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 dark:text-slate-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown panel */}
                <div className={`absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200/80 dark:border-slate-800 py-1.5 transition-all duration-200 origin-top-right ${isDropdownOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible'}`}>
                  {/* Signed-in info */}
                  <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Signed in as</p>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{user.email}</p>
                  </div>

                  <Link
                    href={`/${user.role}/dashboard`}
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mx-1 rounded-md"
                  >
                    <LayoutDashboard size={14} />
                    Dashboard
                  </Link>

                  <Link
                    href={`/${user.role}/profile`}
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mx-1 rounded-md"
                  >
                    <UserIcon size={14} />
                    My Profile
                  </Link>

                  <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-[calc(100%-8px)] flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors mx-1 rounded-md"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Guest CTA */
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="hidden sm:block px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-sm font-semibold rounded-md shadow-sm transition-all active:scale-[0.98]"
                >
                  Get Started
                </Link>
                {/* Mobile menu toggle (guest) */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="sm:hidden p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile guest menu */}
      <div
        className={`fixed inset-x-0 top-[71px] bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-md sm:hidden transition-all duration-300 ease-in-out z-[90] ${isMobileMenuOpen && !user ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'}`}
      >
        <div className="px-4 pt-3 pb-6 flex flex-col gap-3">
          <Link
            href="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full py-2.5 text-center text-sm font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full py-2.5 text-center bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-md transition-all"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default AuthNavbar;
