'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  UserCheck, ClipboardList, FileText, Users,
  GraduationCap, ShieldCheck, ArrowRight, ChevronDown, Settings
} from 'lucide-react';

const steps = [
  {
    title: 'Register / Login',
    desc: 'Join the platform as a student or faculty member and securely access your dashboard.',
    icon: UserCheck,
  },
  {
    title: 'Complete Profile',
    desc: 'Fill in your academic details and research interests to get personalized recommendations.',
    icon: ClipboardList,
  },
  {
    title: 'Submit Proposal',
    desc: 'Draft and upload your thesis or project proposal for formal review.',
    icon: FileText,
  },
  {
    title: 'Supervisor Review',
    desc: 'Assigned supervisors will provide feedback and guide your initial proposal.',
    icon: Users,
  },
  {
    title: 'Committee Approval',
    desc: 'The academic committee reviews and provides final authorization for your work.',
    icon: GraduationCap,
  },
  {
    title: 'Defense',
    desc: 'Present your completed research to the defense board for final evaluation and grading.',
    icon: ShieldCheck,
  },
];

const HowItWorks = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="py-24 bg-white dark:bg-slate-900 relative overflow-hidden border-b border-slate-200/60 dark:border-slate-800/60"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-100/40 dark:bg-indigo-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-100/30 dark:bg-indigo-900/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className={`text-center mb-16 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
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

        <div className="relative">
          <div className="hidden lg:block absolute inset-0 pointer-events-none" aria-hidden="true">
            <svg
              className="w-full h-full"
              viewBox="0 0 1200 500"
              preserveAspectRatio="xMidYMid meet"
              opacity="0.12"
            >
              <defs>
                <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="1" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <path
                d="M 200 80 L 1000 80 L 1000 220 L 200 220 L 200 360 L 1000 360"
                stroke="url(#pathGrad)"
                strokeWidth="2"
                strokeDasharray="8 8"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {steps.map((step, idx) => {
              const Icon = step.icon;

              return (
                <div
                  key={idx}
                  className={`relative bg-white dark:bg-slate-950 p-8 rounded-xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm transition-all duration-700 ease-out group hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 hover:border-indigo-400/50 dark:hover:border-indigo-500/50 ${
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${idx * 120}ms` }}
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-50/0 to-indigo-100/0 dark:from-indigo-950/0 dark:to-indigo-900/0 group-hover:from-indigo-50/50 dark:group-hover:from-indigo-950/30 group-hover:to-indigo-100/30 dark:group-hover:to-indigo-900/20 transition-all duration-500 pointer-events-none" />

                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-indigo-600 dark:bg-indigo-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-600/20 group-hover:scale-110 group-hover:shadow-indigo-600/40 transition-all duration-300 z-10">
                    {idx + 1}
                  </div>

                  <div className="relative">
                    <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg flex items-center justify-center mb-6 group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-indigo-500/20">
                      <Icon className="text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors duration-300" size={24} />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                      {step.title}
                    </h3>

                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors duration-300">
                      {step.desc}
                    </p>
                  </div>

                  {(idx + 1) % 3 !== 0 && idx < steps.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-4 w-7 h-7 -translate-y-1/2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-full items-center justify-center shadow-sm group-hover:border-indigo-300 dark:group-hover:border-indigo-600 group-hover:shadow-md group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/60 transition-all duration-300 z-20">
                      <ArrowRight size={12} className="text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors duration-300" />
                    </div>
                  )}

                  {idx === 2 && (
                    <div className="hidden lg:flex absolute -bottom-4 left-1/2 -translate-x-1/2 w-7 h-7 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-full items-center justify-center shadow-sm transition-all duration-300 z-20">
                      <ChevronDown size={12} className="text-slate-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
