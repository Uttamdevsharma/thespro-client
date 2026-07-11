'use client';

import React from 'react';
import { BookOpen, Target, Cpu, Users, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { label: 'System Accuracy', value: '99.9%' },
  { label: 'Active Researchers', value: '500+' },
  { label: 'Research Papers', value: '1200+' },
  { label: 'Collaboration Rate', value: '85%' },
];

const features = [
  {
    title: 'Dynamic Proposal Tracking',
    desc: 'Real-time monitoring of thesis submissions and feedback loops between students and supervisors.',
    icon: Target,
    accent: 'indigo',
  },
  {
    title: 'Smart Matching System',
    desc: 'Algorithmic mapping of students to supervisors based on research interests and capacity.',
    icon: Cpu,
    accent: 'violet',
  },
  {
    title: 'Unified Communication',
    desc: 'Integrated messaging and notification systems to keep all academic roles synchronized.',
    icon: Users,
    accent: 'emerald',
  },
];

const accentMap: Record<string, { badge: string; badgeText: string; dot: string; cardHover: string; iconBg: string; iconColor: string }> = {
  indigo: {
    badge: 'bg-indigo-100 dark:bg-indigo-900/30',
    badgeText: 'text-indigo-600 dark:text-indigo-400',
    dot: 'bg-indigo-600',
    cardHover: 'hover:border-indigo-200 dark:hover:border-indigo-800',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
  },
  violet: {
    badge: 'bg-violet-100 dark:bg-violet-900/30',
    badgeText: 'text-violet-600 dark:text-violet-400',
    dot: 'bg-violet-600',
    cardHover: 'hover:border-violet-200 dark:hover:border-violet-800',
    iconBg: 'bg-violet-100 dark:bg-violet-900/30',
    iconColor: 'text-violet-600 dark:text-violet-400',
  },
  emerald: {
    badge: 'bg-emerald-100 dark:bg-emerald-900/30',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
    dot: 'bg-emerald-600',
    cardHover: 'hover:border-emerald-200 dark:hover:border-emerald-800',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
};

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/30 via-white to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-24 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 w-64 h-64 bg-indigo-50 dark:bg-indigo-950/50 rounded-full blur-[100px] -z-10" />
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6">
            <Sparkles size={14} />
            Discover Our Mission
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-gray-50 tracking-tight mb-8">
            Thes<span className="text-indigo-600 dark:text-indigo-400">Pro</span> Platform
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 font-bold max-w-3xl mx-auto leading-relaxed">
            A state-of-the-art management system designed to streamline the complex world of 
            academic thesis and research project supervision.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-gray-900 dark:text-gray-50 tracking-tight">System Purpose</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                ThesPro was born out of the need for a unified, transparent, and efficient 
                environment for academic research. We bridge the gap between initial ideation 
                and final defense by providing tools that empower both students and educators.
              </p>
            </div>
            <ul className="space-y-6">
              {[
                { title: 'Standardization', text: 'Ensuring all research follows institutional standards.' },
                { title: 'Efficiency', text: 'Reducing administrative overhead for faculty and students.' },
                { title: 'Accountability', text: 'Clear tracking of deadlines, feedback, and milestones.' },
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 dark:text-gray-50">{item.title}</h4>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200/40 dark:from-indigo-800/20 to-transparent rounded-[3rem] -rotate-3" />
            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[3rem] p-8 border border-gray-100 dark:border-gray-800 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-center items-center text-center hover:shadow-lg transition-shadow">
                    <span className="text-3xl font-black text-gray-900 dark:text-gray-50">{stat.value}</span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Summary */}
        <div className="space-y-16">
          <div className="text-center">
            <h2 className="text-4xl font-black text-gray-900 dark:text-gray-50 mb-4">Core Ecosystem</h2>
            <div className="w-24 h-2 bg-indigo-600 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => {
              const accent = accentMap[f.accent];
              return (
                <div
                  key={i}
                  className={`group bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-10 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 ${accent.cardHover} relative overflow-hidden`}
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 ${accent.iconBg} opacity-30 rounded-bl-[4rem] group-hover:opacity-50 transition-opacity`} />
                  <div className={`w-14 h-14 ${accent.iconBg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                    <f.icon size={28} className={accent.iconColor} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-gray-50 mb-4">{f.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 font-bold leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Conclusion Callout */}
        <div className="mt-32 bg-gradient-to-br from-indigo-900 via-indigo-950 to-gray-900 rounded-[4rem] p-16 relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]" />
          <Sparkles className="text-indigo-400 mx-auto mb-8" size={48} />
          <h2 className="text-4xl font-black text-white mb-6">Empowering the Future of Academic Research</h2>
          <p className="text-gray-400 text-lg font-bold max-w-2xl mx-auto mb-10">
            Join us in revolutionizing how research projects are managed, tracked, and defended. 
            ThesPro is more than just software—it's a commitment to academic growth.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-2xl shadow-indigo-900/30 hover:shadow-indigo-500/30 transition-all hover:scale-105 active:scale-[0.98]"
          >
            Get Started Today
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
