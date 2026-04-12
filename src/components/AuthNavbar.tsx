import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/features/userSlice';
import { useRouter } from 'next/navigation';
import { Menu, X, LogOut, User as UserIcon, LogIn, UserPlus, ChevronDown } from 'lucide-react';
import NotificationBell from './NotificationBell';

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

  const getInitial = () => {
    return user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 h-20 border-b border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">

          <div className="flex items-center space-x-2">
            {/* Sidebar Toggle (Only for logged in users on dashboard-like layouts) */}
            {user && (
              <button
                onClick={toggleSidebar}
                className="p-2 mr-2 rounded-xl text-gray-600 hover:bg-gray-100 focus:outline-none md:hidden transition-colors"
                title="Toggle Sidebar"
              >
                <Menu size={24} />
              </button>
            )}

            {/* Logo + ThesPro Title */}
            <Link href="/" className="flex items-center space-x-2 select-none hover:opacity-90 transition-opacity" onClick={closeMobileMenu}>
              <img
                src="/system-logo.png"
                alt="ThesPro Logo"
                className="h-10 w-auto sm:h-12"
              />
              <span className="text-xl sm:text-3xl font-bold text-[#50C878] tracking-tight">
                ThesPro
              </span>
            </Link>
          </div>

          {/* User Tools (Desktop & Mobile) */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {!user ? (
              <div className="hidden md:flex items-center space-x-4">
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-[#50C878] transition-colors flex items-center gap-2"
                >
                  <LogIn size={18} />
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="px-6 py-2.5 bg-[#50C878] text-white text-sm font-black rounded-xl shadow-lg shadow-green-100 hover:bg-[#45b66d] hover:scale-105 transition-all flex items-center gap-2 active:scale-95"
                >
                  <UserPlus size={18} />
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <NotificationBell />
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 focus:outline-none group hover:bg-gray-50 p-1 rounded-2xl transition-all border border-transparent hover:border-gray-100"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#50C878] to-[#45b66d] flex items-center justify-center text-white font-black text-base sm:text-lg shadow-md group-hover:shadow-lg transition-all border-2 border-white overflow-hidden">
                      {user.profilePicture ? (
                        <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        getInitial()
                      )}
                    </div>
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-sm font-bold text-gray-800 leading-tight">{user.name}</span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black">{user.role}</span>
                    </div>
                    <ChevronDown 
                      className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-5 py-4 border-b border-gray-50 mb-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Signed in as</p>
                        <p className="text-sm font-bold text-gray-800 truncate">{user.email}</p>
                      </div>
                      
                      <Link 
                        href={`/${user.role}/profile`}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center px-5 py-3.5 text-sm font-bold text-gray-700 hover:bg-green-50 hover:text-[#50C878] transition-colors mx-2 rounded-xl"
                      >
                        <UserIcon className="w-4 h-4 mr-3" />
                        My Profile
                      </Link>
                      
                      <button 
                        onClick={handleLogout}
                        className="w-[calc(100%-1rem)] flex items-center px-5 py-3.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors mx-2 rounded-xl"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile (Un-authed only menu toggle) */}
            {!user && (
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 focus:outline-none transition-colors"
                >
                  {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Menu Overlay (Guest only) */}
      {isMobileMenuOpen && !user && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-2xl z-40 animate-in slide-in-from-top duration-300">
          <div className="px-4 py-8 space-y-6">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/login" 
                onClick={closeMobileMenu}
                className="w-full py-4 text-center font-bold text-gray-700 hover:bg-gray-50 rounded-2xl transition-colors border-2 border-transparent"
              >
                Login
              </Link>
              <Link 
                href="/register" 
                onClick={closeMobileMenu}
                className="w-full py-4 text-center bg-[#50C878] text-white font-black rounded-2xl shadow-lg shadow-green-100 active:scale-95 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AuthNavbar;
