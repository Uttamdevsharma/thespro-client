'use client';

import React from 'react';
import Link from 'next/link';
import {
  BrainCircuit,
  ShieldAlert,
  Globe,
  Cpu,
  Cloud,
  MessageSquareText,
  Layers,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';

interface Theme {
  icon: LucideIcon;
  accent: string;
  hoverBg: string;
  hoverText: string;
  iconBg: string;
  iconColor: string;
  gradient: string;
  line: string;
  ring: string;
}

const THEMES: { pattern: RegExp; theme: Theme }[] = [
  {
    pattern: /\b(ai|artificial intelligence|machine learning|deep learning|data scien|neural|nlp|natural language|computer vision|big data|analytics)\b/i,
    theme: {
      icon: BrainCircuit,
      accent: 'bg-indigo-500',
      hoverBg: 'group-hover:bg-indigo-500',
      hoverText: 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400',
      iconBg: 'bg-indigo-50 dark:bg-indigo-950/40',
      iconColor: 'text-indigo-500 dark:text-indigo-400',
      gradient: 'from-indigo-500/5 to-transparent',
      line: 'bg-indigo-500',
      ring: 'ring-indigo-500/20',
    },
  },
  {
    pattern: /\b(cyber|security|information security|network security|cryptography|forensic|penetration|ethical hacking|firewall)\b/i,
    theme: {
      icon: ShieldAlert,
      accent: 'bg-rose-500',
      hoverBg: 'group-hover:bg-rose-500',
      hoverText: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
      iconBg: 'bg-rose-50 dark:bg-rose-950/40',
      iconColor: 'text-rose-500 dark:text-rose-400',
      gradient: 'from-rose-500/5 to-transparent',
      line: 'bg-rose-500',
      ring: 'ring-rose-500/20',
    },
  },
  {
    pattern: /\b(web|frontend|front-end|fullstack|full-stack|software|app develop|mobile|android|ios|react|angular|vue|node|django|spring)\b/i,
    theme: {
      icon: Globe,
      accent: 'bg-cyan-500',
      hoverBg: 'group-hover:bg-cyan-500',
      hoverText: 'group-hover:text-cyan-600 dark:group-hover:text-cyan-400',
      iconBg: 'bg-cyan-50 dark:bg-cyan-950/40',
      iconColor: 'text-cyan-500 dark:text-cyan-400',
      gradient: 'from-cyan-500/5 to-transparent',
      line: 'bg-cyan-500',
      ring: 'ring-cyan-500/20',
    },
  },
  {
    pattern: /\b(iot|internet of things|embedded|robot|robotics|hardware|sensor|fpga|soc|microcontroller|arduino|raspberry)\b/i,
    theme: {
      icon: Cpu,
      accent: 'bg-amber-500',
      hoverBg: 'group-hover:bg-amber-500',
      hoverText: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
      iconBg: 'bg-amber-50 dark:bg-amber-950/40',
      iconColor: 'text-amber-500 dark:text-amber-400',
      gradient: 'from-amber-500/5 to-transparent',
      line: 'bg-amber-500',
      ring: 'ring-amber-500/20',
    },
  },
  {
    pattern: /\b(cloud|devops|docker|kubernetes|aws|azure|ci\/cd|infrastructure|microservice)\b/i,
    theme: {
      icon: Cloud,
      accent: 'bg-violet-500',
      hoverBg: 'group-hover:bg-violet-500',
      hoverText: 'group-hover:text-violet-600 dark:group-hover:text-violet-400',
      iconBg: 'bg-violet-50 dark:bg-violet-950/40',
      iconColor: 'text-violet-500 dark:text-violet-400',
      gradient: 'from-violet-500/5 to-transparent',
      line: 'bg-violet-500',
      ring: 'ring-violet-500/20',
    },
  },
  {
    pattern: /\b(nlp|language|linguistic|text|speech|chatbot|conversation|translation)\b/i,
    theme: {
      icon: MessageSquareText,
      accent: 'bg-emerald-500',
      hoverBg: 'group-hover:bg-emerald-500',
      hoverText: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/40',
      iconColor: 'text-emerald-500 dark:text-emerald-400',
      gradient: 'from-emerald-500/5 to-transparent',
      line: 'bg-emerald-500',
      ring: 'ring-emerald-500/20',
    },
  },
];

const DEFAULT_THEME: Theme = {
  icon: Layers,
  accent: 'bg-slate-500',
  hoverBg: 'group-hover:bg-slate-600',
  hoverText: 'group-hover:text-slate-700 dark:group-hover:text-slate-300',
  iconBg: 'bg-slate-50 dark:bg-slate-800',
  iconColor: 'text-slate-400 dark:text-slate-500',
  gradient: 'from-slate-500/5 to-transparent',
  line: 'bg-slate-500',
  ring: 'ring-slate-500/20',
};

function getTheme(title: string): Theme {
  for (const { pattern, theme } of THEMES) {
    if (pattern.test(title)) return theme;
  }
  return DEFAULT_THEME;
}

interface ResearchCellCardProps {
  cell: {
    _id: string;
    title: string;
    department: string;
  };
  departmentName?: string;
  selectedDeptId: string | null;
}

const ResearchCellCard: React.FC<ResearchCellCardProps> = ({ cell, departmentName, selectedDeptId }) => {
  const t = getTheme(cell.title);
  const Icon = t.icon;

  return (
    <Link
      href={`/browse-supervisors?department=${selectedDeptId}&cell=${cell._id}`}
      className="group relative p-7 bg-white dark:bg-gray-900 border border-slate-200/70 dark:border-slate-800 rounded-2xl hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg hover:shadow-black/[0.04] dark:hover:shadow-black/[0.2] transition-all duration-300 flex flex-col items-start overflow-hidden h-full"
    >
      {/* Subtle corner gradient */}
      <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${t.gradient} rounded-bl-[4rem] group-hover:scale-150 transition-transform duration-500`} />

      {/* Icon */}
      <div className="relative mb-5">
        <div className={`w-12 h-12 ${t.iconBg} rounded-xl flex items-center justify-center ${t.hoverBg} group-hover:rotate-6 transition-all duration-300`}>
          <Icon className={`${t.iconColor} group-hover:text-white transition-colors`} size={24} />
        </div>
      </div>

      {/* Content */}
      <div className="relative space-y-2 flex-grow">
        {departmentName && (
          <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {departmentName}
          </span>
        )}
        <h4 className={`text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug ${t.hoverText} transition-colors`}>
          {cell.title}
        </h4>
        <p className="text-sm text-slate-400 dark:text-slate-500 leading-relaxed">
          Explore research opportunities and connect with specialized supervisors in this field.
        </p>
      </div>

      {/* Footer */}
      <div className="relative mt-6 flex items-center justify-between w-full">
        <div className="flex items-center space-x-2">
          <span className={`text-[10px] font-bold text-slate-900 dark:text-slate-300 uppercase tracking-[0.15em] ${t.hoverText} transition-colors`}>
            Browse Projects
          </span>
          <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
        </div>

        <div className="w-9 h-9 rounded-full border border-slate-100 dark:border-slate-700 flex items-center justify-center group-hover:border-transparent transition-all duration-300">
          <ArrowUpRight size={16} className="text-slate-400 dark:text-slate-500 group-hover:text-white transition-colors" />
        </div>
      </div>

      {/* Bottom accent line — colored per theme */}
      <div className={`absolute bottom-0 left-0 w-0 h-[2px] ${t.line} group-hover:w-full transition-all duration-500`} />
    </Link>
  );
};

export default ResearchCellCard;
