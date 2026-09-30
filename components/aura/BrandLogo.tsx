'use client';

import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
  showSubtitle?: boolean;
}

export function BrandLogo({
  className = '',
  size = 'md',
  theme = 'light',
  showSubtitle = false,
}: BrandLogoProps) {
  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const textSizes = {
    sm: 'text-base font-bold',
    md: 'text-xl font-extrabold',
    lg: 'text-2xl font-black',
  };

  const isDark = theme === 'dark';

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Custom Bio-Geometric Icon Mark */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 via-emerald-500 to-teal-400 p-1 shadow-md shadow-teal-500/25`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-full h-full text-white"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Stylized organic pulse helix mark */}
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10" opacity="0.4" />
          <path d="M4 12h3l2-4 3 8 2.5-5 1.5 2h4" strokeWidth="2.5" />
          <circle cx="20" cy="12" r="1.5" fill="currentColor" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span
          className={`${textSizes[size]} tracking-tight leading-none ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          aura
          <span className="text-teal-500 font-bold ml-0.5">.</span>
        </span>
        {showSubtitle && (
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-0.5">
            health ai
          </span>
        )}
      </div>
    </div>
  );
}
