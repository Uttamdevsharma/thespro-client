'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUI } from '@/contexts/UIContext';
import { X } from 'lucide-react';

interface LinkItem {
  to?: string;
  label: string;
  subLinks?: LinkItem[];
}

interface SidebarProps {
  role: 'committee' | 'supervisor' | 'student' | 'admin';
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { isSidebarOpen, closeSidebar } = useUI();

  const handleDropdownToggle = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
        closeSidebar();
    }
  };

  const committeeLinks: LinkItem[] = [
    { to: '/committee/dashboard', label: 'Dashboard' },
    { to: '/committee/pending-proposals', label: 'Pending Proposals' },
    { to: '/committee/cell-members', label: 'Cell Members' },
    { to: '/committee/all-students', label: 'All Students' },
    { to: '/committee/research-cells', label: 'Research Cell' },
    { to: '/committee/committee-members', label: 'Committee Members' },
    { to: '/committee/notice-management', label: 'Notice Management' },
    { to: '/committee/defense-schedule', label: 'Defense Schedule' },
    { to: '/committee/set-submission-dates', label: 'Set Submission Dates' },
    { to: '/committee/manage-course-supervisors', label: 'Manage Course Supervisors' },
    { to: '/committee/defense-boards', label: 'Defense Boards' },
    { to: '/committee/all-board-results', label: 'All Board Results' },
  ];

  const adminLinks: LinkItem[] = [
    { to: '/admin/dashboard', label: 'Admin Dashboard' },
    { to: '/admin/thesis-cycles', label: 'Thesis Cycles' },
    { to: '/admin/analytics', label: 'Cycle Analytics' },
    { to: '/admin/departments', label: 'Department Management' },
    { to: '/admin/teachers', label: 'Teacher Management' },
    { to: '/admin/students', label: 'Student Management' },
    { to: '/admin/committee', label: 'Committee Assignment' },
  ];

  const supervisorLinks: LinkItem[] = [
    { to: '/supervisor/dashboard', label: 'Dashboard' },
    { to: '/supervisor/pending-proposals', label: 'Pending Proposals' },
    { to: '/supervisor/all-groups', label: 'All Groups' },
    { to: '/supervisor/my-supervisions', label: 'Group Assessment' },
    { to: '/supervisor/committee-evaluations', label: 'Board Evaluation' },
    { to: '/supervisor/defense-schedule', label: 'Defense Schedule' },
    { to: '/supervisor/defense-result', label: 'Group Feedback' },
    { to: '/supervisor/notice', label: 'Notice' },
  ];

  const studentLinks: LinkItem[] = [
    { to: '/student/dashboard', label: 'Dashboard' },
    { to: '/student/proposal', label: 'Proposal' },
    { to: '/student/proposal-status', label: 'Proposal Status' },
    { to: '/student/defense-schedule', label: 'Defense Schedule' },
    { to: '/student/my-results', label: 'My Results' },
  ];

  const linksMap = {
    committee: committeeLinks,
    supervisor: supervisorLinks,
    student: studentLinks,
    admin: adminLinks,
  };

  const links = linksMap[role] || [];

  const renderLink = (link: LinkItem, isSubLink = false) => {
    const baseClasses = 'block px-4 py-3 rounded-xl transition-all duration-200 font-bold mb-1 cursor-pointer';
    const subLinkClass = isSubLink ? 'pl-8 text-sm' : 'text-sm';

    if (link.subLinks) {
      return (
        <div key={link.label}>
          <button
            onClick={() => handleDropdownToggle(link.label)}
            className={`${baseClasses} w-full text-left flex justify-between items-center ${
              openDropdown === link.label ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <span>{link.label}</span>
            <span className={`text-xs transform transition-transform ${openDropdown === link.label ? 'rotate-180' : ''}`}>▼</span>
          </button>
          {openDropdown === link.label && (
            <ul className="mt-1">
              {link.subLinks.map((subLink) => (
                <li key={subLink.to}>
                  {renderLink(subLink, true)}
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    if (!link.to) return null;

    const isActive = pathname === link.to;

    return (
      <Link
        href={link.to}
        onClick={handleLinkClick}
        className={`${baseClasses} ${subLinkClass} relative ${
          isActive
            ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/30'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400'
        }`}
      >
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-full" />
        )}
        {link.label}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 h-screen md:h-auto overflow-y-auto custom-scrollbar
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
            {/* Mobile Header in Sidebar */}
            <div className="flex items-center justify-between p-6 md:hidden border-b border-gray-50 dark:border-gray-800">
                <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">Navigation</span>
                <button onClick={closeSidebar} className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-200">
                    <X size={24} />
                </button>
            </div>

            <ul className="flex-1 p-4 mt-2">
                {links.map((link) => (
                    <li key={link.label || link.to}>
                        {renderLink(link)}
                    </li>
                ))}
            </ul>
            
            {/* Footer space */}
            <div className="p-6 border-t border-gray-50 dark:border-gray-800 mt-auto">
                <p className="text-[10px] text-gray-400 dark:text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest text-center">Version 1.0 - ThesPro</p>
            </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
